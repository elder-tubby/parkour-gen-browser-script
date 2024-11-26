('use strict');

window.parkourGenerator = {
    keepPositions: true,
};

// Shared state object
const selectedState = {
    type: null,
    group: null,
    mapId: null
  };

createMainUI();
