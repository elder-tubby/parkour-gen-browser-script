// Create a new <style> element
const style = document.createElement('style');
style.innerHTML = `
    /* Container styles */
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
    }

    .create-map-button {
        width: 130px;
    }

    .timer-display {
        font-size: 20px;
        font-family: 'futurept_b1';
        margin-bottom: 10px;
        padding: 8px;
    }

    .timer-button-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
        gap: 10px;
    }

    .control-button-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
    }

    .paste-start-button {
        width: 130px;
    }

    #mainUIPanel {
        position: fixed;
        top: 50px;
        left: 50px;
        width: 180px;
        background-color: #cfd8cd;
        border: 2px solid #ccc;
        border-radius: 3px;
        padding: 0px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        overflow: hidden;
        font-family: futurept_b1;
        transition: width 0.3s, height 0.3s;
    }

    .header {
        background-color: #009688;
        color: white;
        font-size: 17px;
        padding: 5px;
        padding-left: 25px;
        border-radius: 3px 3px 0 0;
        text-align: left;
        width: calc(100% + 30px);
        margin-left: 0px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .toggle-button {
        position: absolute;
        right: 3px;
        top: 3.5px;
        width: 25px;
        height: 25px;
        border-radius: 3px;
        background-color: #80544c;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 15px;
        line-height: 30px;
    }

    .styled-button {
        font-family: 'futurept_b1';
        background-color: #80544c;
        color: white;
        font-size: 14px;
        border: none;
        padding: 5px;
        margin: 5px;
        cursor: pointer;
        border-radius: 3px;
    }

    .styled-button:disabled {
        background-color: grey;
        cursor: not-allowed;
    }

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

    .map-timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
    }

    .map-button-container {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-bottom: 10px;
    }

    .timer-display {
        font-size: 20px;
        font-family: 'futurept_b1';
        margin-bottom: 10px;
        padding: 8px;
    }

    .timer-button-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
        gap: 10px;
    }

    .control-button-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
        gap: 10px;
    }

    .map-button {
        width: 200px;
    }

    .paste-start-button {
        width: 130px;
    }
`;

// Append the <style> element to the <head> of the document
document.head.appendChild(style);