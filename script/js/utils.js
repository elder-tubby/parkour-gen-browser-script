let canSendChatMessage = true;

function makeElementDraggable(element) {
    let posX = 0,
        posY = 0,
        mouseX = 0,
        mouseY = 0,
        isResizing = false;

    element.addEventListener('mousedown', function (e) {

        if (e.target.tagName === 'SELECT' || e.target.closest('select') || e.target.closest('button')) {
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

function createCheckbox(onClick, labelText, checkBoxValue) {
    console.log(`checkboxvalue is ${checkBoxValue} for ${labelText}`);
    // Create a checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checkBoxValue;

    // Create a label element
    const label = document.createElement('label');
    label.textContent = labelText;

    // Add an event listener for checking and unchecking
    checkbox.addEventListener('change', () => {
        onClick(checkbox.checked);
    });

    // Append the checkbox and label to a container div
    const container = document.createElement('div');
    container.className = 'checkbox-container';

    // Add classes to the checkbox and label for further styling
    checkbox.className = 'checkbox';
    label.className = 'checkbox-label';

    container.appendChild(label);
    container.appendChild(checkbox);

    return container;
}

function createStyledButton(text, onClick, canPressAndHold, id) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.classList.add('styled-button'); // Add the CSS class
    if (id) button.id = id; // Assign an id to the button

    let intervalId = null;

    button.addEventListener('mousedown', () => {
        // Start calling the function immediately
        onClick();
        if (canPressAndHold) {
            // Set an interval to repeat the function call every 100 milliseconds
            intervalId = setInterval(onClick, 200);
        }
    });
    if (canPressAndHold) {
        button.addEventListener('mouseup', () => {
            // Stop the repeating action when the button is released
            clearInterval(intervalId);
            intervalId = null;
        });

        button.addEventListener('mouseleave', () => {
            // Stop the repeating action if the mouse leaves the button (in case it wasn't released)
            clearInterval(intervalId);
            intervalId = null;
        });
    }
    return button;
}

function createNotificationElement() {
    const notification = document.createElement('div');
    notification.classList.add('notification'); // Add the CSS class
    document.body.appendChild(notification);
    return notification;
}

function toggleButtonVisibility() {
    const type1UIElementsContainer = document.getElementById('type1-button-container');
    type1UIElementsContainer.style.display = 'none';


    if (selectedState.type == Object.keys(mapsStructureData)[0]) {

        type1UIElementsContainer.style.display = 'flex';
    }
}

function showNotification(message, duration = 3000) {
    const notificationElement = createNotificationElement();
    notificationElement.textContent = message;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, duration);
}

function disableMapRelatedButtons(disable) {
    // Fetch the buttons using their unique IDs
    // const startFirstMapButton = document.getElementById('startFirstMapButton');
    const createMapButton = document.getElementById('createMapButton');
    const createAndStartButton = document.getElementById('createAndStartButton');

    // Check if the elements exist in the DOM before attempting to modify them
    // if (!startFirstMapButton || !createMapButton || !createAndStartButton) {
    // console.error('One or more elements not found in the DOM');
    // return;  // Exit the function if elements are not found
    // }

    const elements = [
        // startFirstMapButton,
        createMapButton,
        createAndStartButton
    ];

    elements.forEach(element => {
        if (disable) {
            // Apply "disabled" styles to simulate the disabled state
            element.style.pointerEvents = 'none';  // Disable mouse interaction
            element.style.backgroundColor = 'darkgray';
            element.style.cursor = 'not-allowed';  // Change the cursor to "not-allowed"
        } else {
            // Reset to enable the element
            element.style.pointerEvents = '';  // Re-enable mouse interaction
            element.style.backgroundColor = '#80544c';
            element.style.cursor = '';  // Reset the cursor style
        }
    });
}

function sendChatMessage(message) {
    if (!canSendChatMessage) return;
    this.window.bonkHost.toolFunctions.networkEngine.chatMessage(message);
}

function toggleChatMessagePermission(checkBoxValue) {
    // If checkBoxValue exists, set canSendChatMessage to that value
    if (checkBoxValue != null) {
        canSendChatMessage = checkBoxValue;
    } else {
        // Otherwise, toggle the value of canSendChatMessage
        canSendChatMessage = !canSendChatMessage;
    }
}
function toggleKeepPostion(checkBoxValue) {
    // If newValue is provided, set keepPositions to that value
    if (checkBoxValue != null) {
        window.parkourGenerator.keepPositions = checkBoxValue;
    } else {
        // Otherwise, toggle the current value of keepPositions
        window.parkourGenerator.keepPositions = !window.parkourGenerator.keepPositions;
    }

    console.log("parkourGenerator.keepPositions: ", window.parkourGenerator.keepPositions);
}

function startGameWithBonkHostKeepPosOff() {
    let tempBonkHostKeepPosValue = window.bonkHost.keepState;
    window.bonkHost.keepState = false;
    window.bonkHost.startGame();
    window.bonkHost.keepState = tempBonkHostKeepPosValue;
}