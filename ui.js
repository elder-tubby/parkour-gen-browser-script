
let buttonsInactive = false; // Set to true to start with buttons inactive
function createContainer() {
  const container = document.createElement('div');
  container.id = 'mainUIPanel';
  makeElementDraggable(container); // Makes the container draggable
  return container;
}

function createHeading() {
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

function createMainUI() {
  const container = createContainer();
  const heading = createHeading();
  const contentWrapper = createContentWrapper();

  container.appendChild(heading); // Append heading to the container
  container.appendChild(contentWrapper); // Append contentWrapper to the container
  const groupURL = 'https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/groups.json';

  // Fetch map groups from GitHub
  fetchMapGroups(groupURL)
    .then(() => {

      createTypeButtons(contentWrapper);

      createMapGroupAndMapDropdowns(contentWrapper); // Add map group dropdowns

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

function createTypeButtons(container) {
  // Create the row container for the buttons
  const typeButtonContainer = document.createElement('div');
  typeButtonContainer.classList.add('type-button-container');

  // Create and append buttons for Type 1, 2, and 3
  const type1Button = createStyledButton('Type 1', () => toggleDropdownVisibility('type1'));
  const type2Button = createStyledButton('Type 2', () => toggleDropdownVisibility('type2'));
  const type3Button = createStyledButton('Type 3', () => toggleDropdownVisibility('type3'));

  typeButtonContainer.appendChild(type1Button);
  typeButtonContainer.appendChild(type2Button);
  typeButtonContainer.appendChild(type3Button);

  // Append the typeButtonContainer to the main container
  container.appendChild(typeButtonContainer);
}

function toggleDropdownVisibility(selectedType) {
  // Hide all dropdown UI elements
  const mapGroupDropdownContainer = document.getElementById('mapGroupDropdownContainer');
  const mapsListDropdownContainer = document.getElementById('mapsListDropdownContainer');

  // Default behavior: Hide both dropdown containers
  mapGroupDropdownContainer.style.display = 'none';
  mapsListDropdownContainer.style.display = 'none';

  // Show the selected dropdown UI
  if (selectedType === 'type1') {
    mapGroupDropdownContainer.style.display = 'block'; // Show Map Group Dropdown
    mapsListDropdownContainer.style.display = 'block'; // Show Maps List Dropdown
  }

  // You can add more conditions for 'type2' and 'type3' if needed
}

// Modify the `createMapGroupAndMapDropdowns` function to hide them initially
function createMapGroupAndMapDropdowns(container) {
  // Create and append the map group dropdown container
  const mapGroupDropdownContainer = document.createElement('div');
  mapGroupDropdownContainer.id = 'mapGroupDropdownContainer';
  mapGroupDropdownContainer.style.display = 'none'; // Initially hidden

  const mapGroupOptions = Object.keys(mapGroups);
  const mapGroupDropdown = createDropdown(mapGroupOptions, 'Select Map Group');
  mapGroupDropdownContainer.appendChild(mapGroupDropdown);
  container.appendChild(mapGroupDropdownContainer);

  // Create and append the maps list dropdown container
  const mapsListDropdownContainer = document.createElement('div');
  mapsListDropdownContainer.id = 'mapsListDropdownContainer';
  mapsListDropdownContainer.style.display = 'none'; // Initially hidden

  const mapsListDropdown = createDropdown([], 'Select Map');
  mapsListDropdownContainer.appendChild(mapsListDropdown);
  container.appendChild(mapsListDropdownContainer);

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
}


// Fetch map groups from GitHub
function fetchMapGroups(groupURL) {
  return fetch(groupURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load groups JSON');
      }
      return response.json();
    })
    .then(data => {
      mapGroups = data;  // Store the fetched data in mapGroups
    })
    .catch(error => {
      console.error('Error fetching groups data:', error);
      alert('Failed to load group data. Please try again later.');
    });
}

// Helper function to create a dropdown element
function createDropdown(options, placeholderText) {
  const dropdown = document.createElement('select');
  dropdown.style.marginBottom = '10px';
  dropdown.style.width = '150px';  // Adjust width as needed
  dropdown.style.zIndex = '1020';  // Ensure it appears above other elements
  dropdown.style.pointerEvents = 'auto';  // Ensure it's clickable

  // Create placeholder option
  const placeholderOption = document.createElement('option');
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  placeholderOption.text = placeholderText;
  dropdown.appendChild(placeholderOption);

  // Populate with options
  options.forEach(optionText => {
    const option = document.createElement('option');
    option.value = optionText;
    option.text = optionText;
    dropdown.appendChild(option);
  });

  return dropdown;
}


// Function to load the map JSON data from GitHub
function loadMapJSON(mapFileName) {
  const mapURL = `https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/map-data/${mapFileName}`;

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

function makeElementDraggable(element) {
  let posX = 0,
    posY = 0,
    mouseX = 0,
    mouseY = 0,
    isResizing = false;

  element.addEventListener('mousedown', function (e) {

    if (e.target.tagName === 'SELECT' || e.target.closest('select')) {
      return; // Don't start drag if clicking on a dropdown
    }
    if (isNearResizeArea(e, element)) {
      isResizing = true;
      return;
    }
    isResizing = false;
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  });

  function elementDrag(e) {
    if (isResizing) return;

    e.preventDefault();
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    element.style.top = element.offsetTop - posY + 'px';
    element.style.left = element.offsetLeft - posX + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function isNearResizeArea(e, element) {
    const rect = element.getBoundingClientRect();
    const offset = 20;
    return e.clientX > rect.right - offset && e.clientY > rect.bottom - offset;
  }
}
function createStyledButton(text, onClick) {
  const button = document.createElement('button');
  button.innerHTML = text;
  button.classList.add('styled-button'); // Add the CSS class
  button.addEventListener('click', e => {
    if (buttonsInactive) {
      e.preventDefault(); // Prevent default action
      return; // Exit if buttons are inactive
    }
    onClick(); // Call the provided onClick function if active
  });
  return button;
}

function createNotificationElement() {
  const notification = document.createElement('div');
  notification.classList.add('notification'); // Add the CSS class
  document.body.appendChild(notification);
  return notification;
}

function showNotification(message, duration = 3000) {
  const notificationElement = createNotificationElement();
  notificationElement.textContent = message;
  notificationElement.style.display = 'block';
  setTimeout(() => {
    notificationElement.style.display = 'none';
  }, duration);
}
function createMapAndTimerUI(container) {
  container.classList.add('map-timer-container');

  // Create UI elements
  const mapButtonContainer = createMapButtonContainer();
  const timerDisplay = createTimerDisplay();
  const timerButtonContainer = createTimerButtonContainer();
  const controlButtonContainer = createControlButtonContainer();
  const pasteAndStartButton = createPasteAndStartButton();

  // Append UI elements to container
  container.appendChild(mapButtonContainer);
  container.appendChild(timerDisplay);
  container.appendChild(timerButtonContainer);
  container.appendChild(controlButtonContainer);
  container.appendChild(pasteAndStartButton);
}

function createMapButtonContainer() {
  const container = document.createElement('div');
  container.classList.add('map-button-container');

  const createMapButton = createStyledButton('Create', () => createAndSetMap(currentMapData));
  createMapButton.classList.add('map-button');

  const createAndStartButton = createStyledButton('Create And Start', createAndStartGame);
  createAndStartButton.classList.add('map-button');

  container.appendChild(createMapButton);
  container.appendChild(createAndStartButton);

  return container;
}

function createAndStartGame() {
  createAndSetMap(currentMapData);

  const isLobbyHidden = document.getElementById('newbonklobby').style.display === 'none';
  if (isLobbyHidden) {
    window.parkourGenerator.keepPositions = true;
  }

  window.bonkHost.startGame();
  console.log(window.bonkHost);
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

async function pasteAndStart() {
  try {
    const text = await navigator.clipboard.readText();
    if (text.trim()) {
      showNotification('Map generated successfully! Starting the map...');
      createAndSetMap(text);

      const isLobbyHidden = document.getElementById('newbonklobby').style.display === 'none';
      if (isLobbyHidden) {
        window.parkourGenerator.keepPositions = false;
      }

      window.bonkHost.startGame();
    } else {
      showNotification('Clipboard is empty. Copy map data first.');
    }
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
    showNotification('Failed to read clipboard.');
  }
}

console.log("Loaded ui.js");
