// function createMainUI() {
//   const container = createMainContainer();
//   const heading = createMainHeading();
//   const contentWrapper = createContentWrapper();

//   // Fetch map groups from GitHub
//   fetchMapsStructure()
//     .then(() => {
//       const typeDropdown = new TypeDropdown(contentWrapper);

//       createUIForType1(contentWrapper);
//       // createUIForType2(contentWrapper); // Add map group dropdowns

//       createTimerUI(contentWrapper);
//       createOtherUI(contentWrapper);

//       createToggleUIVisibilityButton(container, contentWrapper); // Add sthe stoggle button for collapsing/expanding

//     })
//     .catch(error => {
//       console.error('Error loading map structure file:', error);
//     });

//   container.appendChild(heading); // Append heading to the container
//   container.appendChild(contentWrapper); // Append contentWrapper to the container
//   document.body.appendChild(container);

//   return container;
// }

// function createMainContainer() {
//   const container = document.createElement('div');
//   container.id = 'mainUIPanel';
//   makeElementDraggable(container); // Makes the container draggable
//   return container;
// }

// function createMainHeading() {
//   const heading = document.createElement('div');
//   heading.innerText = 'Parkour Generator';
//   heading.classList.add('header');
//   return heading;
// }

// function createContentWrapper() {
//   const contentWrapper = document.createElement('div');
//   contentWrapper.id = 'contentWrapper';
//   contentWrapper.style.display = 'block'; // Default to visible
//   return contentWrapper;
// }

// function createToggleUIVisibilityButton(container, contentWrapper) {
//   const toggleButton = document.createElement('button');
//   toggleButton.innerHTML = '-'; // Start with a "-" icon
//   toggleButton.classList.add('toggle-button');

//   let isCollapsed = false; // Track if collapsed or expanded

//   toggleButton.addEventListener('click', () => {
//     if (!isCollapsed) {
//       // Collapse the container
//       contentWrapper.style.display = 'none';
//       container.style.height = '40px'; // Shrink to just show the toggle button
//       container.style.overflow = 'hidden'; // Hide scrollbars when collapsed
//       toggleButton.innerHTML = '+'; // Change to "+" when collapsed
//     } else {
//       // Expand the container
//       contentWrapper.style.display = 'block';
//       container.style.height = ''; // Auto height based on content
//       toggleButton.innerHTML = '-'; // Change to "-" when expanded
//     }
//     isCollapsed = !isCollapsed;
//   });

//   container.appendChild(toggleButton); // Append toggle button to the container
// }

// function createUIForType2(container) {

//   // Create the start button for the first map
//   const startFirstMapButton = createStyledButton('Start First Map', () => {
//     const selectedGroup = mapGroupDropdown.value;  // Get the currently selected group
//     const firstMap = listOfGroups[selectedGroup] ? listOfGroups[selectedGroup][0] : null;  // Get the first map of the selected group

//     if (firstMap) {
//       mapData = fetchCurrentMapData(firstMap.mapId);  // Fetch and load the first map using its mapId
//     }
//   });
//   startFirstMapButton.classList.add('paste-start-button');
//   startFirstMapButton.id = 'startFirstMapButton';  // Assign an ID

//   container.appendChild(startFirstMapButton);
// }

// function createOtherUI(container) {
//   const pasteAndStartButton = createPasteAndStartButton();
//   const chatMessageToggleContainer = createCheckbox(toggleChatMessagePermission, "Chat alerts", true);
//   const keepPostionsContainer = createCheckbox(toggleKeepPostion, "Keep positions", true);

//   container.appendChild(pasteAndStartButton);
//   container.appendChild(chatMessageToggleContainer);
//   container.appendChild(keepPostionsContainer);
// }

// function createTimerUI(container) {
//   container.classList.add('map-timer-container');

//   // Create UI elements
//   const timerDisplay = createTimerDisplay();
//   const timerButtonContainer = createTimerChangeContainer();
//   const timerOptionsContainer = createTimerOptionsContainer();

//   // Append UI elements to container
//   container.appendChild(timerDisplay);
//   container.appendChild(timerButtonContainer);
//   container.appendChild(timerOptionsContainer);

// }

// function createUIForType1(container) {
//   const type1ButtonContainer = document.createElement('div');
//   type1ButtonContainer.id = 'type1-button-container';
//   type1ButtonContainer.classList.add('type1-button-container');

//   const createMapButton = createStyledButton('Create', () => createMap());
//   createMapButton.classList.add('map-button');
//   createMapButton.id = 'createMapButton';  // Assign an ID

//   const createAndStartButton = createStyledButton('Create And Start', createAndStartMap);
//   createAndStartButton.classList.add('map-button');
//   createAndStartButton.id = 'createAndStartButton';  // Assign an ID

//   type1ButtonContainer.style.display = 'none';

//   type1ButtonContainer.appendChild(createMapButton);
//   type1ButtonContainer.appendChild(createAndStartButton);

//   container.appendChild(type1ButtonContainer);
// }

// function createTimerDisplay() {
//   const timerDisplay = document.createElement('div');
//   timerDisplay.id = 'timerDisplay';
//   timerDisplay.classList.add('timer-display');
//   timerDisplay.innerHTML = '00:00';

//   return timerDisplay;
// }

// function createTimerChangeContainer() {
//   const container = document.createElement('div');
//   container.classList.add('timer-change-container');

//   const incrementButton = createStyledButton(`+${timerChangeAmount} Sec`, increment, true);
//   const decrementButton = createStyledButton(`-${timerChangeAmount} Sec`, decrement, true);
//   incrementButton.style.width = '70px';
//   decrementButton.style.width = '70px';

//   container.appendChild(incrementButton);
//   container.appendChild(decrementButton);

//   return container;
// }

// function createTimerOptionsContainer() {
//   const innerContainer = document.createElement('div');
//   innerContainer.classList.add('timer-start-stop-container');

//   const startButton = createStyledButton('Start', start, false, 'startButton');
//   const stopButton = createStyledButton('Pause', stop, false, 'stopButton');
//   stopButton.style.display = 'none'; // Initially hide the stop button

//   const resetButton = createStyledButton('Reset', resetTimer);

//   const setLoopDurationButton = createStyledButton('Set current time as loop duration', setLoopDuration);
//   setLoopDurationButton.classList.add('set-loop-duration-button');

//   innerContainer.appendChild(startButton);
//   innerContainer.appendChild(stopButton);
//   innerContainer.appendChild(resetButton);

//   const outerContainer = document.createElement('div');

//   outerContainer.appendChild(innerContainer);
//   outerContainer.appendChild(setLoopDurationButton);

//   return outerContainer;
// }

// function createPasteAndStartButton() {
//   const button = createStyledButton('Paste Data And Start', pasteAndStart);
//   button.classList.add('paste-start-button');

//   return button;
// }