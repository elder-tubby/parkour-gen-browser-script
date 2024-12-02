class ChatManager {
    constructor() {
        this.canSendChatMessage = true;  // Instance variable
    }
    static sendChatMessage(message) {
        if (!this.canSendChatMessage) return;
        this.window.bonkHost.toolFunctions.networkEngine.chatMessage(message);
    }

    static toggleChatPermission(checkBoxValue) {
        // If checkBoxValue exists, set canSendChatMessage to that value
        if (checkBoxValue != null) {
            this.canSendChatMessage = checkBoxValue;
        } else {
            // Otherwise, toggle the value of canSendChatMessage
            this.canSendChatMessage = !this.canSendChatMessage;
        }
    }
}
