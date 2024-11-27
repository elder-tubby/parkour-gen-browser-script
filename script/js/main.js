('use strict');



// Shared state object
const selectedState = {
    type: null,
    group: null,
    mapId: null
  };
fetchRandomMapAndAuthorNames();
createMainUI();
