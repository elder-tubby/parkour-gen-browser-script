function createMainUI() {
  const container = createMainContainer();
  const heading = createMainHeading();
  const contentWrapper = createContentWrapper();

  container.appendChild(heading); // Append heading to the container
  container.appendChild(contentWrapper); // Append contentWrapper to the container

mapsStructureData = {
  "Type 1": {
    "Group 1": [
      {
        "mapId": "map1",
        "mapName": "Parkour Map 1"
      },
      {
        "mapId": "map2",
        "mapName": "Parkour Map 2"
      }
    ],
    "Group 2": [
      {
        "mapId": "map3",
        "mapName": "Parkour Map 3"
      },
      {
        "mapId": "map7",
        "mapName": "Parkour Map 7"
      },
      {
        "mapId": "map8",
        "mapName": "Parkour Map 8"
      },
      {
        "mapId": "map9",
        "mapName": "Parkour Map 9"
      }
    ]
  },
  "Type 2": {
    "Group 1": [
      {
        "mapId": "map4",
        "mapName": "Parkour Map 4"
      }
    ],
    "Group 2": [
      {
        "mapId": "map5",
        "mapName": "Parkour Map 5"
      }
    ],
    "Group 3": [
      {
        "mapId": "map6",
        "mapName": "Parkour Map 6"
      }
    ]
  }
};

  // Fetch map groups from GitHub
  // fetchMapsStructure()
  //   .then(() => {



      const typeDropdown = new TypeDropdown(contentWrapper);
      
      createType1ButtonContainer(contentWrapper);
      // createUiForType2(contentWrapper); // Add map group dropdowns

      createMapAndTimerUI(contentWrapper); // Add your other UI elements here

      createToggleButton(container, contentWrapper); // Add sthe stoggle button for collapsing/expanding

    // })
    // .catch(error => {
      // console.error('Error loading map structure file:', error);
      // alert('Failed to load map structure. Please try again later.');
    // });
  document.body.appendChild(container);
  return container;
}

function createMainContainer() {
  const container = document.createElement('div');
  container.id = 'mainUIPanel';
  makeElementDraggable(container); // Makes the container draggable
  return container;
}

function createMainHeading() {
  const heading = document.createElement('div');
  heading.innerText = 'Parkour Generator';
  heading.classList.add('header');
  return heading;
}

function createContentWrapper() {
  const contentWrapper = document.createElement('div');
  contentWrapper.id = 'contentWrapper';
  contentWrapper.style.display = 'block'; // Default to visible
  return contentWrapper;
}

function createToggleButton(container, contentWrapper) {
  const toggleButton = document.createElement('button');
  toggleButton.innerHTML = '-'; // Start with a "-" icon
  toggleButton.classList.add('toggle-button');

  let isCollapsed = false; // Track if collapsed or expanded

  toggleButton.addEventListener('click', () => {
    if (!isCollapsed) {
      // Collapse the container
      contentWrapper.style.display = 'none';
      container.style.height = '40px'; // Shrink to just show the toggle button
      container.style.overflow = 'hidden'; // Hide scrollbars when collapsed
      toggleButton.innerHTML = '+'; // Change to "+" when collapsed
    } else {
      // Expand the container
      contentWrapper.style.display = 'block';
      container.style.height = ''; // Auto height based on content
      toggleButton.innerHTML = '-'; // Change to "-" when expanded
    }
    isCollapsed = !isCollapsed;
  });

  container.appendChild(toggleButton); // Append toggle button to the container
}

function createUiForType2(container) {

  // Create the start button for the first map
  const startFirstMapButton = createStyledButton('Start First Map', () => {
    const selectedGroup = mapGroupDropdown.value;  // Get the currently selected group
    const firstMap = listOfGroups[selectedGroup] ? listOfGroups[selectedGroup][0] : null;  // Get the first map of the selected group

    if (firstMap) {
      fetchAndSetCurrentMap(firstMap.mapId);  // Fetch and load the first map using its mapId
    }
  });
  startFirstMapButton.classList.add('paste-start-button');
  startFirstMapButton.id = 'startFirstMapButton';  // Assign an ID

  container.appendChild(startFirstMapButton);
}

function createMapAndTimerUI(container) {
  container.classList.add('map-timer-container');

  // Create UI elements
  const timerDisplay = createTimerDisplay();
  const timerButtonContainer = createTimerButtonContainer();
  const controlButtonContainer = createControlButtonContainer();
  const pasteAndStartButton = createPasteAndStartButton();

  // Append UI elements to container
  container.appendChild(timerDisplay);
  container.appendChild(timerButtonContainer);
  container.appendChild(controlButtonContainer);
  container.appendChild(pasteAndStartButton);
}

function createType1ButtonContainer(container) {
  // Event listener to load selected map JSON file
  // mapsListDropdown.addEventListener('change', function () {
  //   selectedMapId = mapsListDropdown.value;
  //   const selectedGroup = mapGroupDropdown.value;

  //   if (selectedGroup && selectedMapId) {
  //     fetchAndSetCurrentMap(selectedMapId);
  //   }
  // });

  const type1ButtonContainer = document.createElement('div');
  type1ButtonContainer.id = 'type1-button-container';
  type1ButtonContainer.classList.add('type1-button-container');

  const createMapButton = createStyledButton('Create', () => createAndSetMap());
  createMapButton.classList.add('map-button');
  createMapButton.id = 'createMapButton';  // Assign an ID

  const createAndStartButton = createStyledButton('Create And Start', createAndStartGame);
  createAndStartButton.classList.add('map-button');
  createAndStartButton.id = 'createAndStartButton';  // Assign an ID

  type1ButtonContainer.style.display = 'none';

  type1ButtonContainer.appendChild(createMapButton);
  type1ButtonContainer.appendChild(createAndStartButton);

  container.appendChild(type1ButtonContainer);
}

function createTimerDisplay() {
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timerDisplay';
  timerDisplay.classList.add('timer-display');
  timerDisplay.innerHTML = '00:00';

  return timerDisplay;
}

function createTimerButtonContainer() {
  const container = document.createElement('div');
  container.classList.add('timer-button-container');

  const incrementButton = createStyledButton('+10 Sec', incrementTimer);
  const decrementButton = createStyledButton('-10 Sec', decrementTimer);

  container.appendChild(incrementButton);
  container.appendChild(decrementButton);

  return container;
}

function createControlButtonContainer() {
  const container = document.createElement('div');
  container.classList.add('control-button-container');

  const startButton = createStyledButton('Start', startTimer);
  const stopButton = createStyledButton('Stop', stopTimer);
  const resetButton = createStyledButton('Reset', resetTimer);

  container.appendChild(startButton);
  container.appendChild(stopButton);
  container.appendChild(resetButton);

  return container;
}

function createPasteAndStartButton() {
  const button = createStyledButton('Paste Data And Start', pasteAndStart);
  button.classList.add('paste-start-button');

  return button;
}


