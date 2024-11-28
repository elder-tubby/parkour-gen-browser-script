let timerInterval = null;
let currentTimeInSeconds = 0;
let loopDuration = 0;
const timerChangeAmount = 3;

function incrementTimer() {
  currentTimeInSeconds += timerChangeAmount;
  updateTimerDisplay();
}

function decrementTimer() {
  if (currentTimeInSeconds >= timerChangeAmount) {
    currentTimeInSeconds -= timerChangeAmount;
    updateTimerDisplay();
  }
}

function setLoopDuration() {
  loopDuration = currentTimeInSeconds;
}

function startTimer() {

  toggleStartAndStopButtons();

  let chatMessage = `Timer started. Next map in ${currentTimeInSeconds} seconds.`;

  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (currentTimeInSeconds > 0) {
      currentTimeInSeconds--;
      if (currentTimeInSeconds == 10) {
        chatMessage = `Next map in ${currentTimeInSeconds} seconds`;
        sendChatMessage(chatMessage);
      } else if (currentTimeInSeconds == 3 || currentTimeInSeconds == 2) {
        chatMessage = `${currentTimeInSeconds}`;
        sendChatMessage(chatMessage);
      } else if (currentTimeInSeconds == 1) {
        chatMessage = `${currentTimeInSeconds}`;
        sendChatMessage(chatMessage);
      }
      updateTimerDisplay();
    } else {
      selectAndStartRandomMap();

      showNotification('Timer finished!');
      if (loopDuration == 0) {
        console.log("stoppihn timer");
        stopTimer();
        return;
      }

      currentTimeInSeconds = loopDuration;
      updateTimerDisplay();
    }
  }, 1000);
}

function stopTimer() {

  toggleStartAndStopButtons();

  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  if (timerInterval) stopTimer();
  currentTimeInSeconds = 0;
  loopDuration = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(currentTimeInSeconds / 60);
  const seconds = currentTimeInSeconds % 60;
  document.getElementById('timerDisplay').innerHTML =
    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

// Function to toggle visibility between buttons
function toggleStartAndStopButtons() {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');

  if (startButton.style.display !== 'none') {
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
  } else {
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
  }
}