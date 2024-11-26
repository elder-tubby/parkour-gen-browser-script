('use strict');

window.parkourGenerator = {
    keepPositions: false,
};

// Shared state object
const selectedState = {
    type: null,
    group: null,
    mapId: null
  };

createMainUI();
