
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
  
  
// Helper function to create a dropdown element
function createDropdown(options, placeholderText) {
    const dropdown = document.createElement('select');
    dropdown.style.marginBottom = '10px';
    dropdown.style.width = '150px';  // Adjust width as needed
    dropdown.style.zIndex = '1020';  // Ensure it appears above other elements
    dropdown.style.pointerEvents = 'auto';  // Ensure it's clickable
  
    // Create placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.text = placeholderText;
    dropdown.appendChild(placeholderOption);
  
    // Populate with options
    options.forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.text = optionText;
      dropdown.appendChild(option);
    });
  
    return dropdown;
  }
  
  
function showNotification(message, duration = 3000) {
    const notificationElement = createNotificationElement();
    notificationElement.textContent = message;
    notificationElement.style.display = 'block';
    setTimeout(() => {
      notificationElement.style.display = 'none';
    }, duration);
  }