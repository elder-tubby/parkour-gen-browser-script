function createMap() {
    const currentMapData = fetchCurrentMapData();

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

async function pasteAndStart() {
    try {
        const text = await navigator.clipboard.readText();
        if (text.trim()) {
            showNotification('Map generated successfully! Starting the map...');
            createMap(text);

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
    createMap();

    const isLobbyHidden = document.getElementById('newbonklobby').style.display === 'none';
    if (isLobbyHidden) {
        window.parkourGenerator.keepPositions = true;
    }

    window.bonkHost.startGame();
    console.log(window.bonkHost);
}

