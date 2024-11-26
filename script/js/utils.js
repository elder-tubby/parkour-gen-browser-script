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

function toggleButtonVisibility() {

    console.log("selectedType in toggleButtonVisibility: ", selectedState.type);
    console.log("mapsStructureData[0]: ", Object.keys(mapsStructureData)[0]);

    const type1UiElementsContainer = document.getElementById('type1-button-container');
    type1UiElementsContainer.style.display = 'none';


    if (selectedState.type == Object.keys(mapsStructureData)[0]) {

        type1UiElementsContainer.style.display = 'flex';
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
