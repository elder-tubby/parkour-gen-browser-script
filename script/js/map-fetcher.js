let mapsStructureData;
let currentMapData;
// Fetch map groups from GitHub
function fetchMapsStructure() {
    
  console.log("fetcher");
    const mapsStructureURL = 'https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/groups.json?t=' + Date.now();

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
function loadMapJSON(mapFileName) {
    const mapURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/${mapFileName}?t=` + Date.now();

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

