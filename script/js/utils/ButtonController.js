class ButtonController {
   

    static disableMapCreationButtons(disable) {
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
}