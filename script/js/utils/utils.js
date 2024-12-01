
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

