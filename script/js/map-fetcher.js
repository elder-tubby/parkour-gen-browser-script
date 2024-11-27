let mapsStructureData;

// Fetch map groups from GitHub
function fetchMapsStructure() {

    console.log("fetcher");
    const mapsStructureURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/groups.json?t=${Math.random() * 1000000}`;

    return fetch(mapsStructureURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load groups JSON');
            }
            return response.json();
        })
        .then(data => {
            mapsStructureData = data;
        })
        .catch(error => {
            console.error('Error fetching groups data:', error);
            alert('Failed to load group data. Please try again later.');
        });
}

// Function to load the map JSON data from GitHub and return it
async function fetchCurrentMapData() {
    const mapURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/${selectedState.mapId}.json?t=${Math.random() * 1000000}`;
    console.log("mapURL: ", mapURL);

    try {
        const response = await fetch(mapURL);
        if (!response.ok) {
            throw new Error('Failed to load map JSON');
        }
        const mapData = await response.json();  // Wait for the JSON to be parsed
        console.log('Map data loaded:', mapData);
        return mapData;  // Return the map data
    } catch (error) {
        console.error('Error loading map:', error);
        alert('Failed to load map data. Please try again later.');  // User-friendly error message
        return null;  // Return null if an error occurs
    }
}

// Function to fetch the JSON from a raw GitHub URL and return a random key-value pair
async function fetchRandomMapAndAuthorNames() {
    try {
        // GitHub raw file URL (replace this URL with the actual URL of your raw GitHub JSON file)
        const url = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/mapAndAuthorNames.json?t=${Math.random() * 1000000}`;

        // Fetching the JSON file from GitHub
        const response = await fetch(url);
        const mapAndAuthorNames = await response.json();

        // Getting a random key from the map
        const keys = Object.keys(mapAndAuthorNames);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];

        // Returning the key-value pair
        return {
            key: randomKey,
            value: mapAndAuthorNames[randomKey]
        };
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}

// Fetch the random key-value pair and assign the values to map.m.n and map.m.a
fetchRandomMapAndAuthorNames().then(randomPair => {
    if (randomPair) {
        // Assigning the key to map.m.n and value to map.m.a
        const map = { m: {} };
        map.m.n = randomPair.key; // Assigning the random key to map.m.n
        map.m.a = randomPair.value; // Assigning the value to map.m.a

        console.log('Map:', map);
    }
});

