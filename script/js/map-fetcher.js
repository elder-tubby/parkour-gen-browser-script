let mapsStructureData;

console.log("checking if scirpt loader's version has to be updated too");
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

// Function to load the map JSON data from GitHub
function fetchCurrentMapData() {
    const mapURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/${selectedState.mapId}.json?t=${Math.random() * 1000000}`;
    console.log("mapURL: ", mapURL);
    fetch(mapURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load map JSON');
            }
            return response.json();
        })
        .then(mapData => {
            console.log('Map data loaded:', mapData);
            return mapData;
        })
        .catch(error => {
            console.error('Error loading map:', error);
            alert('Failed to load map data. Please try again later.');  // User-friendlyt error message
        });
    return null;

}

