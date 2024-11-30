class App {
    constructor() {
        this.container = this.createMainContainer();
        this.heading = this.createMainHeading();
        this.contentWrapper = this.createContentWrapper();
        this.isCollapsed = false;
        this.init();
    }

    init() {
        // Fetch map groups from GitHub
        fetchMapsStructure()
            .then(() => {
                this.createToggleUIVisibilityButton();
                new TypeDropdown(this.contentWrapper);
                this.createUIForType1();
                // this.createUIForType2();
                this.createTimerUI();
                this.createOtherUI();
            })
            .catch(error => {
                console.error('Error loading map structure file:', error);
            });

        this.container.appendChild(this.heading);
        this.container.appendChild(this.contentWrapper);
        document.body.appendChild(this.container);
    }



    createMainContainer() {
        const container = document.createElement('div');
        container.id = 'container';
        makeElementDraggable(container); // Makes the container draggable
        return container;
    }

    createMainHeading() {
        const heading = document.createElement('div');
        heading.innerText = 'Parkour Generator';
        heading.classList.add('header');
        return heading;
    }

    createContentWrapper() {
        const contentWrapper = document.createElement('div');
        contentWrapper.id = 'contentWrapper';
        contentWrapper.style.display = 'block'; // Default to visible
        return contentWrapper;
    }

    createToggleUIVisibilityButton() {
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '-'; // Start with a "-" icon
        toggleButton.classList.add('toggle-button');

        toggleButton.addEventListener('click', () => {
            if (!this.isCollapsed) {
                // Collapse the container
                this.contentWrapper.style.display = 'none';
                this.container.style.height = '40px'; // Shrink to just show the toggle button
                this.container.style.overflow = 'hidden'; // Hide scrollbars when collapsed
                toggleButton.innerHTML = '+'; // Change to "+" when collapsed
            } else {
                // Expand the container
                this.contentWrapper.style.display = 'block';
                this.container.style.height = ''; // Auto height based on content
                toggleButton.innerHTML = '-'; // Change to "-" when expanded
            }
            this.isCollapsed = !this.isCollapsed;
        });

        this.container.appendChild(toggleButton); // Append toggle button to the container
    }

    createUIForType2() {

        // Create the start button for the first map
        const startFirstMapButton = createStyledButton('Start First Map', () => {
            const selectedGroup = mapGroupDropdown.value;  // Get the currently selected group
            const firstMap = listOfGroups[selectedGroup] ? listOfGroups[selectedGroup][0] : null;  // Get the first map of the selected group

            if (firstMap) {
                mapData = fetchCurrentMapData(firstMap.mapId);  // Fetch and load the first map using its mapId
            }
        });
        startFirstMapButton.classList.add('paste-start-button');
        startFirstMapButton.id = 'startFirstMapButton';  // Assign an ID

        this.container.appendChild(startFirstMapButton);
    }

    createOtherUI() {
        const pasteAndStartButton = this.createPasteAndStartButton();
        const chatMessageToggleContainer = createCheckbox(toggleChatMessagePermission, "Chat alerts", true);
        const keepPostionsContainer = createCheckbox(toggleKeepPostion, "Keep positions", true);

        this.container.appendChild(pasteAndStartButton);
        this.container.appendChild(chatMessageToggleContainer);
        this.container.appendChild(keepPostionsContainer);
    }

    createTimerUI() {
        this.container.classList.add('map-timer-container');

        // Create UI elements
        const timerDisplay = this.createTimerDisplay();
        const timerButtonContainer = this.createTimerChangeContainer();
        const timerOptionsContainer = this.createTimerOptionsContainer();

        // Append UI elements to container
        this.container.appendChild(timerDisplay);
        this.container.appendChild(timerButtonContainer);
        this.container.appendChild(timerOptionsContainer);

    }

    createUIForType1() {
        const type1ButtonContainer = document.createElement('div');
        type1ButtonContainer.id = 'type1-button-container';
        type1ButtonContainer.classList.add('type1-button-container');

        const createMapButton = createStyledButton('Create', () => createMap());
        createMapButton.classList.add('map-button');
        createMapButton.id = 'createMapButton';  // Assign an ID

        const createAndStartButton = createStyledButton('Create And Start', createAndStartMap);
        createAndStartButton.classList.add('map-button');
        createAndStartButton.id = 'createAndStartButton';  // Assign an ID

        type1ButtonContainer.style.display = 'none';

        type1ButtonContainer.appendChild(createMapButton);
        type1ButtonContainer.appendChild(createAndStartButton);

        this.container.appendChild(type1ButtonContainer);
    }

    createTimerDisplay() {
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timerDisplay';
        timerDisplay.classList.add('timer-display');
        timerDisplay.innerHTML = '00:00';

        return timerDisplay;
    }

    createTimerChangeContainer() {
        const container = document.createElement('div');
        container.classList.add('timer-change-container');

        const incrementButton = createStyledButton(`+${timerChangeAmount} Sec`, incrementTimer, true);
        const decrementButton = createStyledButton(`-${timerChangeAmount} Sec`, decrementTimer, true);
        incrementButton.style.width = '70px';
        decrementButton.style.width = '70px';

        container.appendChild(incrementButton);
        container.appendChild(decrementButton);

        return container;
    }

    createTimerOptionsContainer() {
        const innerContainer = document.createElement('div');
        innerContainer.classList.add('timer-start-stop-container');

        const startButton = createStyledButton('Start', startTimer, false, 'startButton');
        const stopButton = createStyledButton('Pause', stopTimer, false, 'stopButton');
        stopButton.style.display = 'none'; // Initially hide the stop button

        const resetButton = createStyledButton('Reset', resetTimer);

        const setLoopDurationButton = createStyledButton('Set current time as loop duration', setLoopDuration);
        setLoopDurationButton.classList.add('set-loop-duration-button');

        innerContainer.appendChild(startButton);
        innerContainer.appendChild(stopButton);
        innerContainer.appendChild(resetButton);

        const outerContainer = document.createElement('div');

        outerContainer.appendChild(innerContainer);
        outerContainer.appendChild(setLoopDurationButton);

        return outerContainer;
    }

    createPasteAndStartButton() {
        const button = createStyledButton('Paste Data And Start', pasteAndStart);
        button.classList.add('paste-start-button');

        return button;
    }
}