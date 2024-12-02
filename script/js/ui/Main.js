class Main {
    constructor() {
        this.mainContainer = this.createMainContainer();
        this.contentWrapper = this.createContentWrapper();
        this.isCollapsed = false;
        ChatManager.canSendChatMessage = true;
        this.init();
    }

    init() {
        this.setupUI();
        this.mainContainer.appendChild(this.contentWrapper);
        document.body.appendChild(this.mainContainer);
    }

    setupUI() {

        this.createMainHeading();
        this.createToggleUIVisibilityButton();

        // Fetch map groups from GitHub
        MapFetcher.fetchMapsStructure()
            .then(() => {
                this.createTypeRelatedUI();
                new TimerUI(contentWrapper);
                this.createOtherUI();
            })
            .catch(error => {
                console.error('Error loading map structure file:', error);
            });
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
        this.mainContainer.appendChild(heading);
    }

    createContentWrapper() {
        const contentWrapper = document.createElement('div');
        contentWrapper.id = 'contentWrapper';
        contentWrapper.style.display = 'block'; // Default to visible
        return contentWrapper;
    }

    createTypeRelatedUI() {
        const typeSpecificUIManager = new TypeSpecificUIManager(this.contentWrapper);
        new TypeDropdown(this.contentWrapper, typeSpecificUIManager);  // Pass the manager to the TypeDropdown
        this.createUIForType1(typeSpecificUIManager);
        // this.createUIForType2(); 
    }

    createToggleUIVisibilityButton() {
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '-'; // Start with a "-" icon
        toggleButton.classList.add('toggle-button');

        toggleButton.addEventListener('click', () => {
            this.toggleUIVisibility(toggleButton);
        });

        this.mainContainer.appendChild(toggleButton);

        this.toggleUIVisibility(toggleButton);

    }

    toggleUIVisibility(toggleButton) {
        if (this.isCollapsed) {
            this.contentWrapper.style.display = 'none';
            toggleButton.innerHTML = '+';
        } else {
            this.contentWrapper.style.display = 'block';
            toggleButton.innerHTML = '-';
        }
        this.isCollapsed = !this.isCollapsed;
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
        const chatMessageToggleContainer = UIFactory.createCheckbox(ChatManager.toggleChatPermission, "Chat alerts", ChatManager.canSendChatMessage);
        const keepPostionsContainer = UIFactory.createCheckbox(toggleKeepPostion, "Keep positions", true);

        this.contentWrapper.appendChild(pasteAndStartButton);
        this.contentWrapper.appendChild(chatMessageToggleContainer);
        this.contentWrapper.appendChild(keepPostionsContainer);
    }

    createUIForType1(typeSpecificUIManager) {
        const type1ButtonContainer = document.createElement('div');
        type1ButtonContainer.id = 'type1-button-container';
        type1ButtonContainer.classList.add('type1-button-container');

        const createMapButton = UIFactory.createStyledButton('Create', MapManager.createMap);
        createMapButton.classList.add('map-button');
        createMapButton.id = 'createMapButton';  // Assign an ID

        const createAndStartButton = UIFactory.createStyledButton('Create And Start', MapManager.createAndStartMap);
        createAndStartButton.classList.add('map-button');
        createAndStartButton.id = 'createAndStartButton';  // Assign an ID

        type1ButtonContainer.classList.add('hidden');  // Initially hidden
        type1ButtonContainer.appendChild(createMapButton);
        type1ButtonContainer.appendChild(createAndStartButton);

        typeSpecificUIManager.registerUIElements('Type 1', [type1ButtonContainer]);

        this.contentWrapper.appendChild(type1ButtonContainer);
    }

    createPasteAndStartButton() {
        const button = UIFactory.createStyledButton('Paste Data And Start', MapManager.pasteAndStart);
        button.classList.add('paste-start-button');

        return button;
    }
}

    new Main();
