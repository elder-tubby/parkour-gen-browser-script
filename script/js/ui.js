function createMainUI() {
  const container = createMainContainer();
  const heading = createMainHeading();
  const contentWrapper = createContentWrapper();

  container.appendChild(heading); // Append heading to the container
  container.appendChild(contentWrapper); // Append contentWrapper to the container

  // Fetch map groups from GitHub
  fetchMapsStructure()
    .then(() => {

      createTypeDropdown(contentWrapper);

      createUiForType1(contentWrapper); // Add map group dropdowns

      createUiForType2(contentWrapper); // Add map group dropdowns

      createMapAndTimerUI(contentWrapper); // Add your other UI elements here

      createToggleButton(container, contentWrapper); // Add sthe stoggle button for collapsing/expanding

    })
    .catch(error => {
      console.error('Error loading map structure file:', error);
      alert('Failed to load map structure. Please try again later.');
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
  // Define options for Type 1, Type 2, and Type 3
  const typeOptions = ['Type 1', 'Type 2', 'Type 3'];

  // Create the dropdown using the helper function
  const typeDropdown = createDropdown(typeOptions, 'Select Type');
  typeDropdown.classList.add('type-dropdown');  // Add a custom class
  typeDropdown.style.width = '100%';

  // Add event listener for when the dropdown value changes
  typeDropdown.addEventListener('change', function () {
    toggleTypeDropdownVisibility(typeDropdown.value);
  });

  // Append the dropdown directly to the container
  container.appendChild(typeDropdown);
}

function createUiForType1(container) {

  console.log("uityp1");
  const firstType = Object.keys(mapsStructureData)[0];  // This gets the first key (e.g., "Type 1")

  // Set mapGroups to the groups of the first type
  const mapGroups = mapsStructureData[firstType]  // Create and append the map group dropdown
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

    console.log(maps);

    // Clear existing maps options and repopulate
    mapsListDropdown.innerHTML = '';
    mapsListDropdown.appendChild(placeholderOptionMap);  // Keep the placeholder

    // Populate maps list dropdown
    maps.forEach(map => {
      const option = document.createElement('option');
      option.value = map.mapId;  // Use the mapId as the value
      option.text = map.mapName; // Display name without extension
      mapsListDropdown.appendChild(option);
    });

    // Show the maps list dropdown once a group is selected
    mapsListDropdown.style.display = 'block';
  });

  // Event listener to load selected map JSON file
  mapsListDropdown.addEventListener('change', function () {
    const selectedMapId = mapsListDropdown.value;
    const selectedGroup = mapGroupDropdown.value;

    if (selectedGroup && selectedMapId) {
      fetchAndSetCurrentMap(selectedMapId);
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

  type1ChildrenContainer.style.display = 'none';

  container.appendChild(type1ChildrenContainer);
}

function createUiForType2(container) {


  // Dynamically get the second type from mapsStructure
  const secondType = Object.keys(mapsStructureData)[1];  // This gets the second type, e.g., "Type 2"

  // Set mapGroups to the groups of the second type
  const mapGroups = mapsStructureData[secondType];

  // Create and append the map group dropdown
  const mapGroupDropdown = createDropdown(Object.keys(mapGroups), 'Select Map Group');
  mapGroupDropdown.classList.add('dropdown');  // Apply common dropdown style
  mapGroupDropdown.style.width = '100%';


  // Event listener to update the maps dropdown based on selected group
  mapGroupDropdown.addEventListener('change', function () {
    const selectedGroup = mapGroupDropdown.value;
    const maps = mapGroups[selectedGroup] || [];
  });

  const startFirstMapButton = createStyledButton('Start First Map', () => {
    const firstGroup = mapGroups[Object.keys(mapGroups)[0]];  // Get the first group
    const firstMap = firstGroup[0];  // Get the first map object in the first group
    if (firstMap) {
      fetchAndSetCurrentMap(firstMap.mapName);  // Load the first map
    }
  });
  startFirstMapButton.classList.add('paste-start-button');


  // Create a container for type 2 children
  const type2ChildrenContainer = document.createElement('div');
  type2ChildrenContainer.id = 'type2-children-container';
  type2ChildrenContainer.classList.add('type2-children-container');

  // Append dropdowns and button to the container
  type2ChildrenContainer.appendChild(mapGroupDropdown);
  type2ChildrenContainer.appendChild(startFirstMapButton);

  type2ChildrenContainer.style.display = 'none';

  container.appendChild(type2ChildrenContainer);
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


