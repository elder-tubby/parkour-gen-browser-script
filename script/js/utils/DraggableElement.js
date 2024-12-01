class DraggableElement {
    constructor(element) {
        this.element = element;
        this.posX = 0;
        this.posY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isResizing = false;

        this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    onMouseDown(e) {
        // Prevent drag initiation if the target is a SELECT element or a BUTTON
        if (e.target.tagName === 'SELECT' || e.target.closest('select') || e.target.closest('button')) {
            return; // Don't start drag if clicking on a dropdown or button
        }

        // If we are near the resize area, prevent drag initiation
        if (this.isResizingArea(e)) {
            this.isResizing = true;
            return;
        }

        this.isResizing = false;
        e.preventDefault();  // Prevent default behavior (selecting text, etc.)
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        document.onmouseup = this.onMouseUp.bind(this);
        document.onmousemove = this.onMouseMove.bind(this);
    }

    onMouseMove(e) {
        if (this.isResizing) return;  // If resizing, don't move element

        e.preventDefault();  // Prevent default behavior while dragging
        this.posX = this.mouseX - e.clientX;
        this.posY = this.mouseY - e.clientY;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.element.style.top = this.element.offsetTop - this.posY + 'px';
        this.element.style.left = this.element.offsetLeft - this.posX + 'px';
    }

    onMouseUp() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    isResizingArea(e) {
        const rect = this.element.getBoundingClientRect();
        const offset = 20;  // Area around the bottom-right corner to detect resizing
        return e.clientX > rect.right - offset && e.clientY > rect.bottom - offset;
    }
}
