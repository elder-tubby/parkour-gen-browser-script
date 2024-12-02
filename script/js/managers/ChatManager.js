class ChatManager {

    static canSendChatMessage;

    static sendChatMessage(message) {
        if (!ChatManager.canSendChatMessage) return; // Use ChatManager instead of this
        window.bonkHost.toolFunctions.networkEngine.chatMessage(message);
    }

    static toggleChatPermission(checkBoxValue) {
        console.log("cansendcgatmsg: ", ChatManager.canSendChatMessage);
        if (checkBoxValue != null) {
            ChatManager.canSendChatMessage = checkBoxValue; // Use ChatManager instead of this
        } else {
            ChatManager.canSendChatMessage = !ChatManager.canSendChatMessage;
        }
    }
}

