window.parkourGenerator = {
    keepPositions: true,
};

async function createMap(pastedMapData) {
    if (!pastedMapData) {
        try {
            // Await the fetching of map data
            const currentMapData = await fetchCurrentMapData();
            console.log("start of  createamap ");
            const randomMapAndAuthor = await fetchRandomMapAndAuthorNames();
            handleMapCreation(currentMapData, randomMapAndAuthor);  // Pass the fetched data to the map creation function
        } catch (error) {
            console.error('Error loading map data:', error);
        }
    } else {
        const randomMapAndAuthor = await fetchRandomMapAndAuthorNames();
        handleMapCreation(pastedMapData, randomMapAndAuthor);
    }
}


function handleMapCreation(currentMapData, randomMapAndAuthor) {
    console.log("currentMapData in handleMapCreation: ", currentMapData);
    console.log("Random map and author pair: ", randomMapAndAuthor);

    console.log("currentMapData in handlemapcreations: ", currentMapData);

    try {
        const w = parent.frames[0];
        let gs = w.bonkHost.toolFunctions.getGameSettings();
        let map = w.bonkHost.bigClass.mergeIntoNewMap(
            w.bonkHost.bigClass.getBlankMap()
        );
        // Parse the JSON input
        let inputData;
        try {
            if (typeof currentMapData === 'string') {
                inputData = JSON.parse(currentMapData);
            } else {
                inputData = currentMapData; // If it's already an object, just use it
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        // Extract spawn values
        console.log("inputData: ", inputData);

        const spawnX = inputData.spawn !== null && inputData.spawn !== undefined ? inputData.spawn.spawnX : 99999;
        const spawnY = inputData.spawn !== null && inputData.spawn !== undefined ? inputData.spawn.spawnY : 99999;

        const mapSize = inputData.mapSize !== undefined ? inputData.mapSize : 9;

        map.m.a =
            w.bonkHost.players[
                w.bonkHost.toolFunctions.networkEngine.getLSID()
            ].userName;
        map.m.n = 'Generated Parkour';

        if (randomMapAndAuthor) {
            map.m.n = randomMapAndAuthor.key;  // Assign the random key to map.m.n
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

async function pasteAndStart() {
    try {
        const text = await navigator.clipboard.readText();

        // Trim any leading or trailing whitespace from the text
        text = text.trim();

        // Check if text is empty after trimming
        if (!text) {
            showNotification('Clipboard is empty. Copy map data first.');
            return;
        }
        // Attempt to parse the text as JSON
        let parsedData;
        try {
            parsedData = JSON.parse(text);
        } catch (jsonError) {
            throw new Error('Invalid JSON format.');
        }

        // Check if parsedData has the 'spawn' and 'lines' properties
        if (parsedData && parsedData.spawn && Array.isArray(parsedData.lines)) {
            showNotification('Map generated successfully! Starting the map...');
            createMap(text);

            const isLobbyHidden = document.getElementById('newbonklobby').style.display === 'none';
            if (isLobbyHidden) {
                window.parkourGenerator.keepPositions = true;
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

async function createAndStartMap() {
    console.log("start of  createandstartmap ");
    console.log("before createMap in createandstartmap");
    await createMap();
    console.log("after createMap in createandstartmap");

    const isLobbyHidden = document.getElementById('newbonklobby').style.display === 'none';
    if (isLobbyHidden) {
        window.parkourGenerator.keepPositions = true;
    }
    window.parkourGenerator.keepPositions = true;

    console.log("end of  createandstartmap ");
    window.bonkHost.startGame();
}


function selectAndStartRandomMap() {
    // Ensure the type and group are selected
    if (!selectedState.type || !selectedState.group) {
        console.error('No type or group selected!');
        return;
    }

    // Fetch the list of maps for the selected group
    const listOfMaps = mapsStructureData[selectedState.type][selectedState.group];
    if (!listOfMaps) {
        console.error('No maps found for the selected group:', selectedState.group);
        return;
    }

    // Filter out the current mapId to avoid selecting it again
    const availableMaps = listOfMaps.filter(map => map.mapId !== selectedState.mapId);

    // If no available maps to select, log an error and exit
    if (availableMaps.length === 0) {
        console.error('No other maps available to select.');
        return;
    }

    // Choose a random map from the available maps
    const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];

    // Update selectedState.mapId with the new random map's mapId
    selectedState.mapId = randomMap.mapId;

    // Optionally, log the selected map details
    console.log('Selected random map:', randomMap);
    updateMapDropdown();
    // Call createAndStartMap() to start the new map
    createAndStartMap();
}

function updateMapDropdown() {
    // Assuming the MapDropdown is the third dropdown and has a class 'map-dropdown'
    const mapDropdown = document.querySelector('.map-dropdown');
    if (mapDropdown) {
        mapDropdown.value = selectedState.mapId;  // Set the selected map to the new mapId
    }
}

