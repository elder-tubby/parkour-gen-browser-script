class NotificationManager {

    static show(message) {
        const duration = 3000;
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            // notification.remove();
        }, duration);
    }
}
