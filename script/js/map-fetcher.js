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

