function createMainUI() {
  const container = createMainContainer();
  const heading = createMainHeading();
  const contentWrapper = createContentWrapper();

  container.appendChild(heading); // Append heading to the container
  container.appendChild(contentWrapper); // Append contentWrapper to the container
  const groupURL = 'https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/groups.json';

  // Fetch map groups from GitHub
  fetchMapGroups(groupURL)
    .then(() => {

      createTypeDropdown(contentWrapper);

      createUiForType1(contentWrapper); // Add map group dropdowns




      createMapAndTimerUI(contentWrapper); // Add your other UI elements here

      createToggleButton(container, contentWrapper); // Add sthe stoggle button for collapsing/expanding

    })
    .catch(error => {
      console.error('Error loading map groups:', error);
      alert('Failed to load map data. Please try again later.');
    });
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

function createTypeDropdown(container) {
  // Create the select element directly
  const typeDropdown = document.createElement('select');
  typeDropdown.classList.add('type-dropdown');  // Add a custom class

  // Add a default "Select Type" option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';  // Empty value for "no type selected"
  defaultOption.textContent = 'Select Type';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  typeDropdown.appendChild(defaultOption);

  // Define options for Type 1, Type 2, and Type 3
  const typeOptions = ['Type 1', 'Type 2', 'Type 3'];

  // Add the options for Type 1, Type 2, and Type 3
  typeOptions.forEach(type => {
    const option = document.createElement('option');
    option.value = type.toLowerCase();
    option.textContent = type;
    typeDropdown.appendChild(option);
  });

  // Add event listener for when the dropdown value changes
  typeDropdown.addEventListener('change', function () {
    toggleTypeDropdownVisibility(typeDropdown.value);
  });

  // Append the dropdown directly to the container
  container.appendChild(typeDropdown);
}

function toggleTypeDropdownVisibility(selectedType) {
  // Hide all dropdown UI elements
  const mapGroupDropdownContainer = document.getElementById('mapGroupDropdownContainer');
  const mapsListDropdownContainer = document.getElementById('mapsListDropdownContainer');

  const type1ChildrenContainer = document.getElementById('type1-children-container');

  type1ChildrenContainer.style.display = 'none';

  // Show the selected dropdown UI
  if (selectedType === 'type 1') {
    type1ChildrenContainer.style.display = 'block';
  }

  // You can add more conditions for 'type2' and 'type3' if needed
}

function createUiForType1(container) {
  // Create and append the map group dropdown
  const mapGroupDropdown = createDropdown(Object.keys(mapGroups), 'Select Map Group');
  mapGroupDropdown.classList.add('dropdown');  // Apply common dropdown style
  mapGroupDropdown.style.width = '100%';

  // Create and append the maps list dropdown
  const mapsListDropdown = createDropdown([], 'Select Map');
  mapsListDropdown.classList.add('dropdown');  // Apply common dropdown style
  mapsListDropdown.style.width = '100%';

  // Store the placeholder option for maps list to avoid it being overwritten
  const placeholderOptionMap = mapsListDropdown.querySelector('option');

  // Event listener to update the maps dropdown based on selected group
  mapGroupDropdown.addEventListener('change', function () {
    const selectedGroup = mapGroupDropdown.value;
    const maps = mapGroups[selectedGroup] || [];

    // Clear existing maps options and repopulate
    mapsListDropdown.innerHTML = '';
    mapsListDropdown.appendChild(placeholderOptionMap);  // Keep the placeholder

    // Populate maps dropdown
    maps.forEach(map => {
      const option = document.createElement('option');
      option.value = map;
      option.text = map.replace('.json', ''); // Display name without extension
      mapsListDropdown.appendChild(option);
    });

    // Show the maps list dropdown once a group is selected
    mapsListDropdown.style.display = 'block';
  });

  // Event listener to load selected map JSON file
  mapsListDropdown.addEventListener('change', function () {
    const selectedMap = mapsListDropdown.value;
    const selectedGroup = mapGroupDropdown.value;

    if (selectedGroup && selectedMap) {
      const mapFileName = mapGroups[selectedGroup].find(map => map === selectedMap);
      if (mapFileName) {
        loadMapJSON(mapFileName);
      }
    }
  });

  // Create and append the map button container
  const mapButtonContainer = createMapButtonContainer();

  const type1ChildrenContainer = document.createElement('div');
  type1ChildrenContainer.id = 'type1-children-container';
  type1ChildrenContainer.classList.add('type1-children-container');

  type1ChildrenContainer.appendChild(mapGroupDropdown);
  type1ChildrenContainer.appendChild(mapsListDropdown);
  type1ChildrenContainer.appendChild(mapButtonContainer);
  type1ChildrenContainer.appendChild(mapButtonContainer);

  type1ChildrenContainer.style.display = 'none';

  container.appendChild(type1ChildrenContainer);
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

function createMapButtonContainer() {
  const container = document.createElement('div');
  container.id = 'map-button-container';
  container.classList.add('map-button-container');

  const createMapButton = createStyledButton('Create', () => createAndSetMap(currentMapData));
  createMapButton.classList.add('map-button');

  const createAndStartButton = createStyledButton('Create And Start', createAndStartGame);
  createAndStartButton.classList.add('map-button');

  // container.style.display = 'none';

  container.appendChild(createMapButton);
  container.appendChild(createAndStartButton);

  return container;
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


console.log("Loaded ui.js");
