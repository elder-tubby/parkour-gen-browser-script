class Main {
    constructor() {
        this.mainContainer = this.createMainContainer();
        this.heading = this.createMainHeading();

        // used to separate the toggle visibility button from the rest of the UI:
        this.contentWrapper = this.createContentWrapper();
        this.isCollapsed = false;
        this.init();
    }
    

    init() {
        // Fetch map groups from GitHub
        MapFetcher.fetchMapsStructure()
            .then(() => {
                this.createToggleUIVisibilityButton();
                new TypeDropdown(this.contentWrapper);
                this.createUIForType1();
                // this.createUIForType2();
                new TimerUI(contentWrapper);
                this.createOtherUI();
            })
            .catch(error => {
                console.error('Error loading map structure file:', error);
            });

        this.mainContainer.appendChild(this.heading);
        this.mainContainer.appendChild(this.contentWrapper);
        document.body.appendChild(this.mainContainer);
    }

    createMainContainer() {
        const container = document.createElement('div');
        container.id = 'container';
        new DraggableElement(container); // Makes the container draggable
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
                this.mainContainer.style.height = '40px'; // Shrink to just show the toggle button
                this.mainContainer.style.overflow = 'hidden'; // Hide scrollbars when collapsed
                toggleButton.innerHTML = '+'; // Change to "+" when collapsed
            } else {
                // Expand the container
                this.contentWrapper.style.display = 'block';
                this.mainContainer.style.height = ''; // Auto height based on content
                toggleButton.innerHTML = '-'; // Change to "-" when expanded
            }
            this.isCollapsed = !this.isCollapsed;
        });

        this.mainContainer.appendChild(toggleButton); // Append toggle button to the container
    }

    createUIForType2() {

        // Create the start button for the first map
        const startFirstMapButton = UIFactory.createStyledButton('Start First Map', () => {
            const selectedGroup = mapGroupDropdown.value;  // Get the currently selected group
            const firstMap = listOfGroups[selectedGroup] ? listOfGroups[selectedGroup][0] : null;  // Get the first map of the selected group

            if (firstMap) {
                mapData = MapFetcher.fetchCurrentMapData(firstMap.mapId);  // Fetch and load the first map using its mapId
            }
        });
        startFirstMapButton.classList.add('paste-start-button');
        startFirstMapButton.id = 'startFirstMapButton';  // Assign an ID

        this.mainContainer.appendChild(startFirstMapButton);
    }

    createOtherUI() {
        const pasteAndStartButton = this.createPasteAndStartButton();
        const chatMessageToggleContainer = UIFactory.createCheckbox(ChatManager.toggleChatPermission, "Chat alerts", true);
        const keepPostionsContainer = UIFactory.createCheckbox(toggleKeepPostion, "Keep positions", true);

        this.mainContainer.appendChild(pasteAndStartButton);
        this.mainContainer.appendChild(chatMessageToggleContainer);
        this.mainContainer.appendChild(keepPostionsContainer);
    }

    createUIForType1() {
        const type1ButtonContainer = document.createElement('div');
        type1ButtonContainer.id = 'type1-button-container';
        type1ButtonContainer.classList.add('type1-button-container');

        const createMapButton = UIFactory.createStyledButton('Create', MapManager.createMap);
        createMapButton.classList.add('map-button');
        createMapButton.id = 'createMapButton';  // Assign an ID

        const createAndStartButton = UIFactory.createStyledButton('Create And Start', MapManager.createAndStartMap);
        createAndStartButton.classList.add('map-button');
        createAndStartButton.id = 'createAndStartButton';  // Assign an ID

        type1ButtonContainer.style.display = 'none';

        type1ButtonContainer.appendChild(createMapButton);
        type1ButtonContainer.appendChild(createAndStartButton);

        this.mainContainer.appendChild(type1ButtonContainer);
    }

    createPasteAndStartButton() {
        const button = UIFactory.createStyledButton('Paste Data And Start', MapManager.pasteAndStart);
        button.classList.add('paste-start-button');

        return button;
    }
}

new Main();

