// Create a new <style> element
const style = document.createElement('style');
style.innerHTML = `
@font-face {
  font-family: 'futurept_b1';
  src: url('futurept_7a255.otf') format('woff');
  font-weight: normal;
  font-style: normal;
}

/* Create Map Button */
.create-map-button {
  width: 130px;

}

/* Timer Display */
.timer-display {
  font-size: 20px;
  font-family: 'futurept_b1';
  margin-bottom: 10px;
  padding: 8px;
}

/* Timer Button Container */
.timer-change-container {
  display: flex;
  flex-direction: row;
  /* Set the direction to row */
  margin-bottom: 5px;
  /* Optional margin for spacing */
  gap: 10px;
  /* Set gap between buttons */
}



.visible {
  display: flex;
}


.timer-start-stop-container>button:nth-child(1),
.timer-start-stop-container>button:nth-child(2) {
  width: 70px;
  /* margin-right: 2px; */
  /* margin-left: 2px; Adjust the spacing as needed */
}

.timer-start-stop-container>button:nth-child(3) {
  width: 70px;
}

.timer-start-stop-container>button:nth-child(4) {
  /* margin-right: 20px; /* Adjust the spacing as needed */
  /* margin-left: 20px; */

}

/* Main container styles */
#container {
  position: fixed;
  top: 50px;
  left: 50px;
  width: 180px;
  border: 2px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
  font-family: 'futurept_b1';

}

/* Header styles */
.header {
  background-color: #009688;
  /* Greenish color */
  color: white;
  font-size: 17px;
  padding: 5px;
  padding-left: 25px;
  border-radius: 3px 3px 0 0;
  /* Rounded corners at the top */
  text-align: left;
  width: calc(100% + 30px);
  /* Span the full width of the container (including padding) */
  margin-left: 0px;
  /* Adjust to account for padding */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  /* Optional shadow for depth */
}

/* Toggle button styles */
.toggle-button {
  position: absolute;
  right: 3px;
  /* Move to the right outside the container */
  top: 3.5px;
  /* Align near the top */
  width: 25px;
  height: 25px;
  border-radius: 3px;
  /* Circular button */
  background-color: #80544c;
  /* Brownish color */
  color: white;
  /* Text color */
  border: none;
  cursor: pointer;
  font-size: 15px;
  line-height: 30px;
  /* Center the text vertically */
}

/* Button styles */
.styled-button {
  font-family: 'futurept_b1';
  background-color: #80544c;
  /* Default color */
  color: white;
  font-size: 14px;
  border: none;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
}

.styled-button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

/* Notification styles */
.notification {
  position: fixed;
  font-family: 'futurept_b1';
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #009688;
  color: white;
  padding: 10px;
  border-radius: 3px;
  z-index: 1000;
  display: none;
}

/* Map and Timer container styles */
.map-timer-container {
  display: flex;
  flex-direction: column;
  /* Stack buttons vertically */
  align-items: center;
  /* Center items horizontally */
  padding: 5px;
}

.type1-button-container {
  display: flex;
  flex-direction: row;
  /* Align buttons horizontally */
  gap: 10px;
  /* Space between the buttons */
  margin-bottom: 10px;
  /* Optional margin for spacing */
}


/* Timer display styles */
.timer-display {
  font-size: 20px;
  font-family: 'futurept_b1';
  margin-bottom: 10px;
  padding: 8px;
  text-align: center;
  /* border: 1px solid; */
  /* border-radius: 4px; */
  /* Rounded corners */
  /* background-color: #f0f0f0b4; */
}

/* Timer button container styles */
.timer-change-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* Centers buttons horizontally */
  align-items: center;
  /* Centers buttons vertically */
  width: 100%;
  /* Ensure the container uses full width */
  margin-bottom: 5px;
  gap: 10px;
  /* border: 1px solid; */
  border-radius: 4px;
  /* Rounded corners */
  background-color: #f0f0f0b4;
  /* Light background to visually separate */
}

/* Control button container styles */
.timer-start-stop-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* Centers buttons horizontally */
  align-items: center;
  /* Centers buttons vertically */
  width: 100%;
  /* Ensure the container uses full width */
  margin-bottom: 5px;
  /* Align buttons horizontally */
  gap: 10px;
  /* border: 1px solid; */
  border-radius: 4px;
  /* Rounded corners */
  background-color: #f0f0f0b4;
  /* Light background to visually separate */

}

/* Map button styles */
.map-button {
  width: 70px;
}

/* Paste and Start button styles */
.paste-start-button {
  display: flex;
  width: 160px;
  /* Center the content vertically */
  margin: 0 auto;
  /* Center the button within its parent container */
  margin-top: 15px;
}

/* Style for the dropdown container */
.type-dropdown-container {
  margin-bottom: 20px;

}

.type-dropdown {
  padding: 5px;
  font-family: 'futurept_b1';
  font-size: 14px;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;

}


/* Ensure dropdown is block-level */
.dropdown {
  display: block;
  /* Make the select element block-level */
  width: 100%;
  /* Ensure it takes up 50% of the available container width */
  padding: 5px;
  border: 1px solid #ccc;
  font-family: 'futurept_b1';
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  transition: all 0.3s ease;
}

/* #mapGroupDropdownContainer,
#mapsListDropdownContainer { */
/* width: 100%; */

/* Make sure containers are full width */
/* padding: 5px; */
/* } */

.checkbox-container {
  display: flex;
  align-items: center;
  /* Aligns checkbox and label vertically centered */
  margin-top: 30px;
  margin-bottom: 10px;
  /* position: relative; Allows for positioning within the container */
}

.checkbox {
  position: absolute;
  right: 10px;
}

.checkbox-label {
  position: absolute;
  left: 10px;
  font-family: 'futurept_b1';
  /* Make sure 'futurept_b1' is available or fallback to sans-serif */
}

.set-loop-duration-button {
  font-size: 12px;
  margin: 10px;
}

.hidden {
  display: none;
}

/* Main container styles */
#contentWrapper {
  position: relative;
  width: 180px;
  background-color: #cfd8cd;
  border: 2px solid #ccc;
  border-radius: 3px;
  padding: 0px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
`;

// Append the <style> element to the <head> of the document
document.head.appendChild(style);