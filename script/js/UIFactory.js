class UIFactory {
    static createCheckbox(onClick, labelText, checkBoxValue) {

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

    static createStyledButton(text, onClick, canPressAndHold, id) {
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
}