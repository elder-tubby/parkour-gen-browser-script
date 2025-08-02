// ==UserScript==
// @name         pkrGeneratorX
// @version      0.1.0
// @description  A mod to select maps and control a timer in Bonk.io using BonkHUD
// @author       You
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// ==/UserScript==
const style = document.createElement("style");
style.textContent = `
.pkr-select {
    width: 100%; /* or change to a specific value like 150px */
    padding: 2px 4px; /* smaller padding */
    background-color: #1e1e1e;
    color: white;
    border: 1px solid #666;
    border-radius: 4px;
    font-size: 10px; /* smaller font size */
}
`;

document.head.appendChild(style);

"use strict";

window.pkrGeneratorX = {};

pkrGeneratorX.state = {
    chatAlerts: false,
    keepPositions: false,
    selectedGroup: null,
    selectedMapId: null,
    type: 1,
    mapsStructureData: {}, // Loaded from remote
};


// ------------------------------
// Window Configuration
// ------------------------------
pkrGeneratorX.windowConfigs = {
    windowName: "pkrGeneratorX",
    windowId: "pkr_generator_x_window",
    modVersion: "0.1.0",
    bonkLIBVersion: "1.1.3",
    bonkVersion: "49",
    windowContent: null,
};

// ------------------------------
// Dummy Data (to be replaced by real source)
// ------------------------------


pkrGeneratorX.timerModule = {
    currentTime: 0,
    isRunning: false,
    loopDuration: null,
    intervalId: null,

    formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    },

    updateDisplay() {
        const disp = document.getElementById("pkr-timer-display");
        if (disp) disp.textContent = this.formatTime(this.currentTime);
    },

    startLoop() {
        if (this.intervalId) clearInterval(this.intervalId);

        this.intervalId = setInterval(async () => {
            if (!this.isRunning) return;

            this.currentTime = Math.max(0, this.currentTime - 1);
            this.updateDisplay();

            // === 🔔 Send chat messages at critical moments ===
            if (this.currentTime === 10) {
                pkrGeneratorX.chatManager.sendChatMessage("Next map in 10 seconds");
            } else if ([3, 2, 1].includes(this.currentTime)) {
                pkrGeneratorX.chatManager.sendChatMessage(String(this.currentTime));
            }

            // === 🧭 When timer hits 0 ===
            if (this.currentTime === 0) {
                await pkrGeneratorX.mapManager.selectAndStartRandomMap();

                if (this.loopDuration) {
                    this.isRunning = false; // pause during map load
                    clearInterval(this.intervalId);

                    // wait 2 seconds before restarting loop
                    setTimeout(() => {
                        this.currentTime = this.loopDuration;
                        this.updateDisplay();
                        this.isRunning = true;
                        this.startLoop();
                    }, 2000);
                } else {
                    this.stop();
                }
            }
        }, 1000);
    },

    toggleStartPause() {
        this.isRunning = !this.isRunning;

        const btn = document.getElementById("pkr-startpause-btn");
        if (btn) btn.textContent = this.isRunning ? "Pause" : "Start";

        if (this.isRunning) {
            this.startLoop();
        }
    },

    addTime(delta) {
        this.currentTime = Math.max(0, this.currentTime + delta);
        this.updateDisplay();
    },

    reset() {
        this.isRunning = false;
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = null;
        this.currentTime = 0;
        this.updateDisplay();

        const btn = document.getElementById("pkr-startpause-btn");
        if (btn) btn.textContent = "Start";
    },

    stop() {
        this.isRunning = false;
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = null;

        const btn = document.getElementById("pkr-startpause-btn");
        if (btn) btn.textContent = "Start";
    },

    setLoopDuration() {
        if (this.currentTime > 0) {
            this.loopDuration = this.currentTime;
            console.log("Loop duration set to", this.formatTime(this.loopDuration));
        } else {
            console.warn("Cannot set loop duration to 0.");
        }
    }
};

pkrGeneratorX.chatManager = {
    canSendChatMessage: true,

    sendChatMessage(message) {
        if (!pkrGeneratorX.state.chatAlerts) return;
        window.bonkHost?.toolFunctions?.networkEngine?.chatMessage(message);
    }
};

pkrGeneratorX.mapFetcher = {
    async fetchMapsStructure() {
        const url = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/main/map-data/groups.json?t=${Math.random()}`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to load groups');
            const data = await res.json();
            console.log("[MapFetcher] setting _mapsStructure to:", data);
            pkrGeneratorX._mapsStructure = data;
            return data;
        } catch (e) {
            console.error('[MapFetcher] Error fetching groups:', e);
            alert('Failed to load group data');
            return null;
        }
    }
    ,

    async fetchCurrentMapData() {
        const mapId = pkrGeneratorX.state.selectedMapId;
        if (!mapId) return null;

        const url = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/${mapId}.json?t=${Math.random() * 1000000}`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch map JSON");
            return await res.json();
        } catch (err) {
            console.error("Error loading map data:", err);
            alert("Failed to load map. Try again later.");
            return null;
        }
    },

    async fetchRandomMapAndAuthorNames() {
        const url = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/mapAndAuthorNames.json?t=${Math.random() * 1000000}`;
        try {
            const res = await fetch(url);
            const json = await res.json();
            const keys = Object.keys(json);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            return { key: randomKey, value: json[randomKey] };
        } catch (err) {
            console.error("Error fetching map/author names:", err);
            return null;
        }
    },
};

// ------------------------------
// Map Manager
// ------------------------------
window.pkrGeneratorX.mapManager = {



    async createMap() {

        const mapId = pkrGeneratorX.state.selectedMapId;
        if (!mapId) {
            console.error("[MapManager] No map selected.");
            return;
        }
        try {
            console.log("[MapManager] createMap for mapId=", mapId);
            const fetchedData = await pkrGeneratorX.mapFetcher.fetchCurrentMapData(mapId);
            const randomMapAndAuthor = await pkrGeneratorX.mapFetcher.fetchRandomMapAndAuthorNames();
            const w = parent.frames[0];
            let gs = w.bonkHost.toolFunctions.getGameSettings();
            let map = w.bonkHost.bigClass.mergeIntoNewMap(
                w.bonkHost.bigClass.getBlankMap());
            // Parse the JSON input
            let inputData;
            try {
                if (typeof inputText === 'string') {
                    inputData = JSON.parse(fetchedData);
                } else {
                    inputData = fetchedData; // If it's already an object, just use it
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            // Extract spawn values
            const spawnX = inputData.spawn.spawnX;
            const spawnY = inputData.spawn.spawnY;

            const mapSize = this.getProcessedMapSize(inputData);

            map.m.a =
                w.bonkHost.players[
                w.bonkHost.toolFunctions.networkEngine.getLSID()
            ].userName;
            map.m.n = 'Generated Parkour';

            if (randomMapAndAuthor) {
                map.m.n = randomMapAndAuthor.key; // Assign the random key to map.m.n
                map.m.a = randomMapAndAuthor.value; // Assign the random value to map.m.a
            }

            // Set up shapes from the input data
            map.physics.shapes = inputData.lines.map(r => {
                let shape = w.bonkHost.bigClass.getNewBoxShape();
                shape.w = r.width;
                shape.h = r.height;
                shape.c = [r.x, r.y];
                shape.a = r.angle / (180 / Math.PI);
                shape.color = r.color;
                shape.d = true; // Assuming 'd' is always true for shapes
                return shape;
            });

            // Add bodies in batches of 100
            for (let i = 0; i < Math.ceil(map.physics.shapes.length / 100); i++) {
                let body = w.bonkHost.bigClass.getNewBody();
                body.p = [-935, -350];
                body.fx = Array.apply(
                    null,
                    Array(Math.min(100, map.physics.shapes.length - i * 100))).map((_, j) => {
                    return i * 100 + j;
                });
                map.physics.bodies.unshift(body);
            }

            // Create fixtures based on the input data
            map.physics.fixtures = inputData.lines.map((r, i) => {
                let fixture = w.bonkHost.bigClass.getNewFixture();
                fixture.sh = i;
                fixture.d = r.isDeath;
                fixture.re = r.bounciness;
                fixture.fr = r.friction;
                fixture.np = r.noPhysics;
                fixture.ng = r.noGrapple; // Updated to match new JSON structure
                fixture.f = r.color;

                // Set the name based on line attributes
                map.physics.bro = map.physics.bodies.map((_, i) => i);
                if (r.isCapzone) {
                    fixture.n = r.id + '. CZ';
                } else if (r.isNoJump) {
                    fixture.n = r.id + '. NoJump';
                } else if (r.noPhysics) {
                    fixture.n = r.id + '. NoPhysics';
                } else {
                    fixture.n = r.id + '. Shape';
                }

                return fixture;
            });

            map.physics.bro = map.physics.bodies.map((_, i) => i);

            // Add cap zones based on conditions
            inputData.lines.forEach(line => {
                if (line.isCapzone) {
                    // Create a new cap zone object
                    const newCapZone = {
                        n: line.id + '. Cap Zone',
                        ty: 1,
                        l: 0.01,
                        i: line.id,
                    };

                    // Access the existing capZones array and add the new cap zone
                    map.capZones.push(newCapZone);
                }

                if (line.isNoJump) {
                    // Create a new cap zone object for NoJump
                    const newCapZoneNoJump = {
                        n: line.id + '. No=Jump',
                        ty: 2,
                        l: 10,
                        i: line.id,
                    };

                    // Access the existing capZones array and add the new cap zone
                    map.capZones.push(newCapZoneNoJump);
                }
            });

            if (spawnY <= 10000 && spawnX <= 10000) {
                // Set up the spawn based on parsed data
                map.spawns = [{
                    b: true,
                    f: true,
                    gr: false,
                    n: 'Spawn',
                    priority: 5,
                    r: true,
                    x: spawnX,
                    xv: 0,
                    y: spawnY,
                    ye: false,
                    yv: 0,
                },
                             ];
            }

            map.s.nc = true;
            map.s.re = true;
            map.physics.ppm = mapSize;

            gs.map = map;
            w.bonkHost.menuFunctions.setGameSettings(gs);
            w.bonkHost.menuFunctions.updateGameSettings();

            //            showNotification('Map created successfully!');
        } catch (e) {
            console.error('An error occurred while creating the map:', e);
            // showNotification("Failed to create the map. Check the console for errors.");
        }

        // Example use (you can customize this later):
        // window.bonkHost.loadMap(data.mapCode);
        // pkrGeneratorX.chatManager.sendChatMessage(`Map by ${meta.value} loaded!`);
    },

    async createAndStartMap() {
        await this.createMap();

        const keep = pkrGeneratorX.state.keepPositions;
        const bonk = window.bonkHost;

        const tempKeep = bonk.keepState;
        bonk.keepState = keep;
        bonk.startGame();
        bonk.keepState = tempKeep;

        console.log("[MapManager] Game started with keepPositions:", keep);
    },

    async selectAndStartRandomMap() {
        console.log("[MapManager] selectAndStartRandomMap");
        const state = pkrGeneratorX.state;

        const type = `Type ${state.type}`;
        const groupMaps = (pkrGeneratorX._mapsStructure[type] || {})[state.selectedGroup] || [];

        const available = groupMaps.filter(m => m.mapId !== state.selectedMapId);
        if (!available.length) {
            console.warn("[MapManager] No alternate maps available.");
            return;
        }

        const random = available[Math.floor(Math.random() * available.length)];
        console.log("[MapManager] random selection=", random);
        state.selectedMapId = random?.mapId;

        this.updateMapDropdown();
        await this.createAndStartMap();
    },


    transformMapSize(mapSize) {
        const mapSizeMapping = {
            1: 30,
            2: 24,
            3: 20,
            4: 17,
            5: 15,
            6: 13,
            7: 12,
            8: 10,
            9: 9,
            10: 8,
            11: 7,
            12: 6,
            13: 5
        };

        return mapSizeMapping[Math.floor(mapSize)] || 9; // Default to 9 if no match
    },

    getProcessedMapSize(inputData) {
        if (!inputData.version) {
            // No version present, return mapSize as is
            return inputData.mapSize !== undefined ? inputData.mapSize : 9;
        }

        // If version exists, transform the mapSize
        return this.transformMapSize(inputData.mapSize);
    },

    updateMapDropdown() {
        const sel = document.getElementById('pkr-map-select');
        if (sel) sel.value = pkrGeneratorX.state.selectedMapId;
    }
};


// ------------------------------
// CapZone & Step & Frame Event Injector
// ------------------------------
// Borrowed from old cap-event-manager.js
window.bonkAPI = window.bonkAPI || {};
bonkAPI.addEventListener = function (event, method, scope, context) {
    bonkAPI.events.addEventListener(event, method, scope, context);
};


bonkAPI.EventHandler;

(bonkAPI.EventHandler = function () {
    this.hasEvent = [];
}).prototype = {
    /**
     * Begins to listen for the given event to call the method later.
     * @method
     * @memberof EventHandler
     * @param {string} event - Event that is listened for
     * @param {function(object)} method - Function that is called
     * @param {*} [scope] - Where the function should be called from, defaults to window
     * @param {*} [context] - defaults to nothing
     */
    addEventListener: function (event, method, scope, context) {
        var listeners, handlers;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }

        if (!(handlers = listeners[event])) {
            handlers = listeners[event] = [];
            this.hasEvent[event] = true;
        }

        scope = scope ? scope : window;
        handlers.push({
            method: method,
            scope: scope,
            context: context ? context : scope,
        });
    },

    /**
     * Fires the event given to call the methods linked to that event.
     * @method
     * @memberof EventHandler
     * @param {string} event - Event that is being fired
     * @param {object} data - Data sent along with the event
     * @param {*} [context]
     */
    fireEvent: function (event, data, context) {
        var listeners, handlers, handler, l, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[event])) {
            return;
        }
        l = handlers.length;
        for (let i = 0; i < l; i++) {
            handler = handlers[i];
            if (typeof context !== "undefined" && context !== handler.context) {
                continue;
            }
            handler.method.call(handler.scope, data);
        }
    },
};

bonkAPI.events = new bonkAPI.EventHandler();

// *Injecting code into src
bonkAPI.injector = function (src) {
    let newSrc = src;

    //! Inject capZoneEvent fire
    let orgCode = `K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];`;
    let newCode = `
        K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];

        bonkAPI_capZoneEventTry: try {
            // Initialize
            let inputState = z0M[0][0];
            let currentFrame = inputState.rl;
            let playerID = K$h[0][0].m_userData.arrayID;
            let capID = K$h[1];

            let sendObj = { capID: capID, playerID: playerID, currentFrame: currentFrame };

            if (window.bonkAPI.events.hasEvent["capZoneEvent"]) {
                window.bonkAPI.events.fireEvent("capZoneEvent", sendObj);
            }
        } catch(err) {
            console.error("ERROR: capZoneEvent");
            console.error(err);
        }`;

    newSrc = newSrc.replace(orgCode, newCode);

    //! Inject stepEvent fire
    orgCode = `return z0M[720];`;
    newCode = `
        bonkAPI_stepEventTry: try {
            let inputStateClone = JSON.parse(JSON.stringify(z0M[0][0]));
            let currentFrame = inputStateClone.rl;
            let gameStateClone = JSON.parse(JSON.stringify(z0M[720]));

            let sendObj = { inputState: inputStateClone, gameState: gameStateClone, currentFrame: currentFrame };

            if (window.bonkAPI.events.hasEvent["stepEvent"]) {
                window.bonkAPI.events.fireEvent("stepEvent", sendObj);
            }
        } catch(err) {
            console.error("ERROR: stepEvent");
            console.error(err);
        }

        return z0M[720];`;

    newSrc = newSrc.replace(orgCode, newCode);

    //! Inject frameIncEvent fire
    //TODO: update to bonk 49
    orgCode = `Y3z[8]++;`;
    newCode = `
        Y3z[8]++;

        bonkAPI_frameIncEventTry: try {
            if (window.bonkAPI.events.hasEvent["frameIncEvent"]) {
                var sendObj = { frame: Y3z[8], gameStates: o3x[7] };

                window.bonkAPI.events.fireEvent("frameIncEvent", sendObj);
            }
        } catch(err) {
            console.error("ERROR: frameIncEvent");
            console.error(err);
        }`;

    // newSrc = newSrc.replace(orgCode, newCode);
    return newSrc;
};

window.bonkCodeInjectors.push((bonkCode) => {
    try {
        console.log("Code injected for Parkour Generator for bonkAPI in injector.js.")
        return bonkAPI.injector(bonkCode);
    } catch (error) {
        console.log('Code injection for parkour generator failed in injector.js.');
        throw error;
    }
});

window.bonkAPI.events.addEventListener("capZoneEvent", function (data) {
    const { capID, playerID, currentFrame } = data;
    console.log(`Player ${playerID} touched the cap zone ${capID} at frame ${currentFrame}`);
});

// ------------------------------
// Keep Positions Injector Module
// ------------------------------
// From old keep-positions-manager.js
pkrGeneratorX.keepPositionsInjector = function (str) {
    let newStr = str;

    ///////////////////
    // From host mod //
    ///////////////////

    const BIGVAR = newStr.match(/[A-Za-z0-9$_]+\[[0-9]{6}\]/)[0].split('[')[0];
    let stateCreationString = newStr.match(
        /[A-Za-z]\[...(\[[0-9]{1,4}\]){2}\]\(\[\{/
    )[0];
    let stateCreationStringIndex = stateCreationString.match(/[0-9]{1,4}/g);
    stateCreationStringIndex =
        stateCreationStringIndex[stateCreationStringIndex.length - 1];
    let stateCreation = newStr.match(
        `[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]=[A-Za-z0-9\$_]{3}\\[[0-9]{1,4}\\]\\[[A-Za-z0-9\$_]{3}\\[[0-9]{1,4}\\]\\[${stateCreationStringIndex}\\]\\].+?(?=;);`
    )[0];
    stateCreationString = stateCreation.split(']')[0] + ']';

    const SET_STATE = `
              if (
                  ${BIGVAR}.bonkHost.state &&
                  !window.bonkHost.keepState &&
                  window.pkrGeneratorX.state.keepPositions &&
                  window.bonkHost.toolFunctions.getGameSettings().ga === "b"
                  ) {
                  ${stateCreationString}.discs = [];
                  for(let i = 0; i < ${BIGVAR}.bonkHost.state.discs.length; i++) {
                      if(${BIGVAR}.bonkHost.state.discs[i] != undefined) {
                          ${stateCreationString}.discs[i] = ${BIGVAR}.bonkHost.state.discs[i];
                          if(window.bonkHost.toolFunctions.getGameSettings().mo=='sp') {
                              ${stateCreationString}.discs[i].a1a -= Math.min(2*30, 2*30 - ${BIGVAR}.bonkHost.state.ftu)*3;
                          }
                      }
                  }
                  for(let i = 0; i < ${BIGVAR}.bonkHost.state.discDeaths.length; i++) {
                      if(${BIGVAR}.bonkHost.state.discDeaths[i] != undefined) {
                          ${stateCreationString}.discDeaths[i] = ${BIGVAR}.bonkHost.state.discDeaths[i];
                      }
                  }
                  ${stateCreationString}.seed=${BIGVAR}.bonkHost.state.seed;
                  ${stateCreationString}.rc=${BIGVAR}.bonkHost.state.rc + 1;
                  ${stateCreationString}.rl=0;
                  ${stateCreationString}.ftu=60;
                  ${stateCreationString}.shk=${BIGVAR}.bonkHost.state.shk;
              };
              `;

    const stateSetRegex = newStr.match(
        /\* 999\),[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],null,[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],true\);/
    )[0];
    newStr = newStr.replace(stateSetRegex, stateSetRegex + SET_STATE);
    return newStr;
};

// ------------------------------
// Bonk Code Injectors Registration
// ------------------------------
if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];

window.bonkCodeInjectors.push((bonkCode) => {
    try {
        console.log("Code injected for Parkour Generator for keepPositions in injector.js.")
        return pkrGeneratorX.keepPositionsInjector(bonkCode);
    } catch (error) {
        console.log('Code injection for parkour generator failed in injector.js.');
        throw error;
    }
});



// Create the mod window using BonkHUD
pkrGeneratorX.createWindow = function () {
    const modIndex = bonkHUD.createMod(this.windowConfigs.windowName, this.windowConfigs);
    bonkHUD.loadUISetting(modIndex);

    // Buttons only inserted after DOM is ready
    const insertButton = (id, label, onClick) => {
        const btn = bonkHUD.generateButton(label);
        btn.id = id;
        btn.style.marginBottom = "5px";
        btn.style.height = "25px";
        const container = document.getElementById(`${id}-container`);
        if (container) {
            container.appendChild(btn);
            btn.addEventListener("click", onClick);
        } else {
            console.warn(`Button container #${id}-container not found`);
        }
    };

    insertButton("pkr-create-map-btn", "Create map", () => {
        console.log("Create map clicked");
    });

    insertButton("pkr-add-3-btn", "+3 Sec", () => this.timerModule.addTime(3));
    insertButton("pkr-sub-3-btn", "-3 Sec", () => this.timerModule.addTime(-3));
    insertButton("pkr-startpause-btn", "Start", () => this.timerModule.toggleStartPause());
    insertButton("pkr-reset-btn", "Reset", () => this.timerModule.reset());
    insertButton("pkr-set-loop-btn", "Set loop duration", () => this.timerModule.setLoopDuration());
};


// ------------------------------
// Build UI
// ------------------------------
pkrGeneratorX.setWindowContent = function () {

    const mapOptionsPlaceholder = "<option value=''>Select map</option>";

    const chatAlertsChecked = this.state?.chatAlerts ? "checked" : "";
    const keepPositionsChecked = this.state?.keepPositions ? "checked" : "";

    const container = document.createElement("div");

    container.innerHTML = `
 <!-- Map Selection Section -->
 <table class="bonkhud-background-color bonkhud-border-color" style="width:100%; margin-top:10px;">
     <caption class="bonkhud-header-color">
         <span class="bonkhud-title-color">Map Selection</span>
     </caption>
     <tr>
         <td class="bonkhud-text-color">Group</td>
         <td>
            <select id="pkr-group-select" class="pkr-select">
  <option value="">Select map group</option>
</select>
         </td>
     </tr>
     <tr>
         <td class="bonkhud-text-color">Map</td>
         <td>
             <select id="pkr-map-select" class="pkr-select">
                 ${mapOptionsPlaceholder}
             </select>
         </td>
     </tr>
     <tr>

        <td colspan="2" style="text-align:center; padding-top:5px;">
             <div id="pkr-create-map-btn-container" style="width:100%;"></div>
         </td>
     </tr>
 </table>


      <!-- Timer Section -->
<table class="bonkhud-background-color bonkhud-border-color" style="margin-top:10px; width:100%;">
    <caption class="bonkhud-header-color">
        <span class="bonkhud-title-color">Timer</span>
    </caption>
    <tr>
        <td colspan="2">
            <div id="pkr-timer-display" class="bonkhud-text-color" style="text-align:center; font-size:1.2em; padding: 5px 0;">
                00:00
            </div>
        </td>
    </tr>
    <tr>
        <td><div id="pkr-add-3-btn-container"></div></td>
        <td><div id="pkr-sub-3-btn-container"></div></td>
    </tr>
    <tr>
        <td><div id="pkr-startpause-btn-container"></div></td>
        <td><div id="pkr-reset-btn-container"></div></td>
    </tr>
    <tr>
        <td colspan="2">
            <div id="pkr-set-loop-btn-container" style="text-align:center;"></div>
        </td>
    </tr>
</table>


        <!-- Extra Checkboxes -->
        <table class="bonkhud-background-color bonkhud-border-color" style="margin-top:10px;">
            <tr>
                <td class="bonkhud-text-color">
                    <label>
                        <input type="checkbox" id="pkr-chat-alerts" ${chatAlertsChecked}/> Chat alerts
                    </label>
                </td>
            </tr>
            <tr>
                <td class="bonkhud-text-color">
                    <label>
                        <input type="checkbox" id="pkr-keep-positions" ${keepPositionsChecked}/> Keep positions
                    </label>
                </td>
            </tr>
        </table>
    `;

    this.windowConfigs.windowContent = container;
};

pkrGeneratorX.populateGroupDropdown = function() {
    const groupSel = document.getElementById("pkr-group-select");
    const groups = Object.keys(this._mapsStructure["Type 1"] || {});
    console.log("[UI] Available groups under Type 1:", groups);
    groupSel.innerHTML = [
        '<option value="">Select map group</option>',
        ...groups.map(g => `<option value="${g}">${g}</option>`)
    ].join('');
};




// ------------------------------
// Wire up Events
// ------------------------------
pkrGeneratorX.bindUI = function () {
    const grp = document.getElementById("pkr-group-select");
    const mp  = document.getElementById("pkr-map-select");
    const btn = document.getElementById("pkr-create-map-btn");

    // populate groups after structure fetched
    this.populateGroupDropdown();

    const updateBtn = () => {
        const ok = !!grp.value && !!mp.value;
        btn.disabled = !ok;
        console.log(`[bindUI] updateBtn — group: ${grp.value}, map: ${mp.value}, disabled: ${btn.disabled}`);
    };

    grp.addEventListener('change', () => {
        const g = grp.value;
        pkrGeneratorX.state.selectedGroup = g;
        console.log("[UI] group changed →", g);

        // drill into Type 1
        const arr = (pkrGeneratorX._mapsStructure["Type 1"] || {})[g] || [];
        console.log("[UI] maps for group", g, "→", arr);

        mp.innerHTML = [
            '<option value="">Select map</option>',
            ...arr.map(m => `<option value="${m.mapId}">${m.mapName}</option>`)
        ].join("");

        pkrGeneratorX.state.selectedMapId = null;
        updateBtn();
    });


    mp.addEventListener("change", () => {
        const m = mp.value;
        pkrGeneratorX.state.selectedMapId = m;
        console.log("[bindUI] map changed →", m);
        updateBtn();
    });

    btn.addEventListener("click", () => {
        console.log("[bindUI] Create Map clicked with", {
            group: pkrGeneratorX.state.selectedGroup,
            mapId: pkrGeneratorX.state.selectedMapId
        });
        pkrGeneratorX.mapManager.createMap();
    });

    // Keep Positions Checkbox
    const keepCheckbox = document.getElementById("pkr-keep-positions");
    if (keepCheckbox) {
        keepCheckbox.addEventListener("change", (e) => {
            pkrGeneratorX.state.keepPositions = e.target.checked;
            console.log("Keep positions:", pkrGeneratorX.state.keepPositions);
        });
    }

    // Chat Alerts Checkbox
    const chatCheckbox = document.getElementById("pkr-chat-alerts");
    if (chatCheckbox) {
        chatCheckbox.addEventListener("change", (e) => {
            const checked = e.target.checked;
            pkrGeneratorX.state.chatAlerts = !pkrGeneratorX.state.chatAlerts;
        });
    }


    updateBtn();




    // Checkboxes can be wired similarly when you add settings.save()
};

// ------------------------------
// Initialization
// ------------------------------
pkrGeneratorX.initMod = async function () {
    if (!window.bonkHUD) {
        console.error("BonkHUD not loaded.");
        return;
    }

    await this.mapFetcher.fetchMapsStructure();
    this.setWindowContent();
    this.createWindow();
    this.bindUI();
    this.timerModule.updateDisplay();
    console.log(this.windowConfigs.windowName, "initialized");
};


pkrGeneratorX.onDocumentReady = function () {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        this.initMod();
    } else {
        document.addEventListener("DOMContentLoaded", () => this.initMod());
    }
};


pkrGeneratorX.onDocumentReady();
