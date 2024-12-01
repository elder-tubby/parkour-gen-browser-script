class MapFetcher {
    constructor() {
        this.baseURL =  `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/groups.json?t=${Math.random() * 1000000}`;
    }

    // Fetch map groups from GitHub
    static fetchMapsStructure() {
        const mapsStructureURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/groups.json?t=${Math.random() * 1000000}`;

        return fetch(mapsStructureURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load groups JSON');
                }
                return response.json();
            })
            .then(data => {
                mapsStructureData = data; // Store the map structure data
            })
            .catch(error => {
                console.error('Error fetching groups data:', error);
                alert('Failed to load group data. Please try again later.');
            });
    }

    // Function to load the map JSON data from GitHub and return it
    static async fetchCurrentMapData() {
        const mapURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/${selectedState.mapId}.json?t=${Math.random() * 1000000}`;

        try {
            const response = await fetch(mapURL);
            if (!response.ok) {
                throw new Error('Failed to load map JSON');
            }
            const mapData = await response.json();
            return mapData; // Return the map data
        } catch (error) {
            console.error('Error loading map:', error);
            alert('Failed to load map data. Please try again later.');
            return null; // Return null if an error occurs
        }
    }

    // Function to fetch a random map and author names
    static async fetchRandomMapAndAuthorNames() {
        const url = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/mapAndAuthorNames.json?t=${Math.random() * 1000000}`;

        try {
            const response = await fetch(url);
            const mapAndAuthorNames = await response.json();

            // Get a random key from the map
            const keys = Object.keys(mapAndAuthorNames);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];

            return {
                key: randomKey,
                value: mapAndAuthorNames[randomKey]
            };
        } catch (error) {
            console.error('Error fetching the JSON file:', error);
            return null; // Return null if an error occurs
        }
    }
}