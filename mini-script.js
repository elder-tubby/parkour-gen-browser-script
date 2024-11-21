
// Create a new <style> element
const style = document.createElement('style');
style.innerHTML = `
    /* Container styles */
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
    }

    #mainUIPanel {
        position: fixed;
        top: 50px;
        left: 50px;
        width: 180px;
        background-color: #cfd8cd;
        border: 2px solid #ccc;
        border-radius: 3px;
        padding: 0px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;

        overflow: hidden;
        font-family: futurept_b1;
        transition: width 0.3s, height 0.3s;
            align-items: center; /* Center contents horizontally */
    justify-content: center; /* Ensure vertical centering if needed */

    }

    .header {
        background-color: #009688;
        color: white;
        font-size: 17px;
        padding: 5px;
        padding-left: 25px;
        border-radius: 3px 3px 0 0;
        text-align: left;
        width: calc(100% + 30px);
        margin-left: 0px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .toggle-button {
        position: absolute;
        right: 3px;
        top: 3.5px;
        width: 25px;
        height: 25px;
        border-radius: 3px;
        background-color: #80544c;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 15px;
        line-height: 30px;
    }

    .styled-button {
        font-family: 'futurept_b1';
        background-color: #80544c;
        color: white;
        font-size: 14px;
        border: none;
        padding: 5px;
        margin: 5px;
        cursor: pointer;
        border-radius: 3px;
    }

    .styled-button:disabled {
        background-color: grey;
        cursor: not-allowed;
    }

    .notification {
        position: fixed;
        font-family: 'futurept_b1';
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #009688;
        color: white;
        padding: 10px;
        border-radius: 3px;
        z-index: 1000;
        display: none;
    }
        .paste-start-button {
  display: flex;
  width: 142px;
  margin: 0 auto;
  margin-top: 5px;
  margin-bottom: 4px;
  text-align: center;
  justify-content: center; /* Center the text horizontally */
  align-items: center; /* Center the text vertically */
}

`;

document.head.appendChild(style);

function createContainer() {
    const container = document.createElement('div');
    container.id = 'mainUIPanel';
    makeElementDraggable(container); 
    return container;
}

function createHeading() {
    const heading = document.createElement('div');
    heading.innerText = 'Parkour Generator';
    heading.classList.add('header');
    return heading;
}

function createContentWrapper() {
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'contentWrapper';
    contentWrapper.style.display = 'block'; // Default to visible
    return contentWrapper;
}

function createToggleButton(container, contentWrapper) {
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '-'; 
    toggleButton.classList.add('toggle-button');

    let isCollapsed = false; 

    toggleButton.addEventListener('click', () => {
        if (!isCollapsed) {
            contentWrapper.style.display = 'none';
            container.style.height = '30px'; 
            container.style.overflow = 'hidden';
            toggleButton.innerHTML = '+';
        } else {

            contentWrapper.style.display = 'block';
            container.style.height = ''; 
            toggleButton.innerHTML = '-'; 
          }
        isCollapsed = !isCollapsed;
    });

    container.appendChild(toggleButton); 
}

function createMainUI() {
    const container = createContainer();
    const heading = createHeading();
    const contentWrapper = createContentWrapper();

    container.appendChild(heading); 
    container.appendChild(contentWrapper); 
    const groupURL = 'https://raw.githubusercontent.com/elder-tubby/parkour-generator-browser-script/refs/heads/main/map-data/groups.json';
    createToggleButton(container, contentWrapper); 

    const pasteAndStartButton = createStyledButton(
        'Paste Data And Start',
        async function () {
            try {
                const text = await navigator.clipboard.readText();
                if (text.trim()) {
                    showNotification('Map generated successfully! Starting the map...');
                    createAndSetMap(text);
                    if (
                        document.getElementById('newbonklobby').style.display === 'none'
                    ) {
                        window.parkourGenerator.keepPositions = false;
                    }
                    window.bonkHost.startGame();
                } else {
                    showNotification('Clipboard is empty. Copy map data first.');
                }
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
                showNotification('Failed to read clipboard.');
            }
        }
    );
    pasteAndStartButton.classList.add('paste-start-button');
    container.appendChild(pasteAndStartButton);

    document.body.appendChild(container);
    return container;
}

function makeElementDraggable(element) {
    let posX = 0,
        posY = 0,
        mouseX = 0,
        mouseY = 0,
        isResizing = false;

    element.addEventListener('mousedown', function (e) {

        if (e.target.tagName === 'SELECT' || e.target.closest('select')) {
            return; // Don't start drag if clicking on a dropdown
        }
        if (isNearResizeArea(e, element)) {
            isResizing = true;
            return;
        }
        isResizing = false;
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    });

    function elementDrag(e) {
        if (isResizing) return;

        e.preventDefault();
        posX = mouseX - e.clientX;
        posY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        element.style.top = element.offsetTop - posY + 'px';
        element.style.left = element.offsetLeft - posX + 'px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function isNearResizeArea(e, element) {
        const rect = element.getBoundingClientRect();
        const offset = 20;
        return e.clientX > rect.right - offset && e.clientY > rect.bottom - offset;
    }
}
function createStyledButton(text, onClick) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.classList.add('styled-button'); // Add the CSS class
    button.addEventListener('click', e => {

        onClick(); // Call the provided onClick function if active
    });
    return button;
}

function createNotificationElement() {
    const notification = document.createElement('div');
    notification.classList.add('notification'); // Add the CSS class
    document.body.appendChild(notification);
    return notification;
}

function showNotification(message, duration = 3000) {
    const notificationElement = createNotificationElement();
    notificationElement.textContent = message;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, duration);
}


console.log("Loaded ui.js");


if (document.getElementById('mainUIPanel')) {
    console.log('UI already exists, skipping creation.');
    // return;
}


window.parkourGenerator = {
    keepPositions: false,
};

function createAndSetMap(red) {
    try {
        const w = parent.frames[0];
        let gs = w.bonkHost.toolFunctions.getGameSettings();
        let map = w.bonkHost.bigClass.mergeIntoNewMap(
            w.bonkHost.bigClass.getBlankMap()
        );
        // Parse the JSON input
        let inputData;
        try {
            if (typeof red === 'string') {
                inputData = JSON.parse(red);
            } else {
                inputData = red; // If it's already an object, just use it
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        // Extract spawn values
        const spawnX = inputData.spawn.spawnX;
        const spawnY = inputData.spawn.spawnY;

        const mapSize = inputData.mapSize !== undefined ? inputData.mapSize : 9;

        map.m.a =
            w.bonkHost.players[
                w.bonkHost.toolFunctions.networkEngine.getLSID()
            ].userName;
        map.m.n = 'Generated Parkour';

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
                Array(Math.min(100, map.physics.shapes.length - i * 100))
            ).map((_, j) => {
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
            map.spawns = [
                {
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

        showNotification('Map created successfully!');
    } catch (e) {
        console.error('An error occurred while creating the map:', e);
        // showNotification("Failed to create the map. Check the console for errors.");
    }
}


('use strict');


createMainUI();


let injector = str => {
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
            window.parkourGenerator.keepPositions &&
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
            window.parkourGenerator.keepPositions = false;
        };
        `;

    const stateSetRegex = newStr.match(
        /\* 999\),[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],null,[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],true\);/
    )[0];
    newStr = newStr.replace(stateSetRegex, stateSetRegex + SET_STATE);
    return newStr;
};

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert('Code injection for parkour generator failed');
        throw error;
    }
});



