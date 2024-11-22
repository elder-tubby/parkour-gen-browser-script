if (document.getElementById('mainUIPanel')) {
  console.log('UI already exists, skipping creation.');
  // return;
}


let timerInterval = null;
let timerSeconds = 0;

window.parkourGenerator = {
  keepPositions: false,
};

function incrementTimer() {
  timerSeconds += 10;
  updateTimerDisplay();
}

function decrementTimer() {
  if (timerSeconds >= 10) {
    timerSeconds -= 10;
    updateTimerDisplay();
  }
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      stopTimer();
      showNotification('Timer finished!');
      // selectRandomMap();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  document.getElementById('timerDisplay').innerHTML =
    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

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

  window.bonkHost.startGame();

}

async function pasteAndStart() {
  try {
    const text = await navigator.clipboard.readText();
    if (text.trim()) {
      showNotification('Map generated successfully! Starting the map...');
      createAndSetMap(text);

      const isLobbyHidden = document.getElementById('newbonklobby').style.display === 'none';
      if (isLobbyHidden) {
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

function createAndStartGame() {
  createAndSetMap(currentMapData);

  const isLobbyHidden = document.getElementById('newbonklobby').style.display === 'none';
  if (isLobbyHidden) {
    window.parkourGenerator.keepPositions = true;
  }

  window.bonkHost.startGame();
  console.log(window.bonkHost);
}

// Fetch map groups from GitHub
function fetchMapGroups(groupURL) {
  return fetch(groupURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load groups JSON');
      }
      return response.json();
    })
    .then(data => {
      mapGroups = data;  // Store the fetched data in mapGroups
    })
    .catch(error => {
      console.error('Error fetching groups data:', error);
      alert('Failed to load group data. Please try again later.');
    });
}

// Function to load the map JSON data from GitHub
function loadMapJSON(mapFileName) {
  const mapURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/${mapFileName}`;

  fetch(mapURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load map JSON');
      }
      return response.json();
    })
    .then(mapData => {
      console.log('Map data loaded:', mapData);
      currentMapData = mapData;
    })
    .catch(error => {
      console.error('Error loading map:', error);
      alert('Failed to load map data. Please try again later.');  // User-friendlyt error message
    });
}