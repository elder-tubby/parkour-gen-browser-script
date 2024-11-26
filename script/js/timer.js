let timerInterval = null;
let timerSeconds = 0;
let resetTime = 0; // Stores the value of 'x' when timer hits 0
const timerChangeAmount = 3;

function incrementTimer() {
  timerSeconds += timerChangeAmount;
  updateTimerDisplay();
}

function decrementTimer() {
  if (timerSeconds >= timerChangeAmount) {
    timerSeconds -= timerChangeAmount;
    updateTimerDisplay();
  }
}

function startTimer() {

  let chatMessage = `Timer started. Next map in ${timerSeconds} seconds.`;

  if (timerInterval) return;
  resetTime = timerSeconds;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      if (timerSeconds == 10) {
        chatMessage = `Next map in ${timerSeconds} seconds`;
        sendChatMessage(chatMessage);
      } else if (timerSeconds == 3 || timerSeconds == 2) {
        chatMessage = `${timerSeconds}`;
        sendChatMessage(chatMessage);
      } else if (timerSeconds == 1) {
        chatMessage = `${timerSeconds}`;
        sendChatMessage(chatMessage);
      }
      updateTimerDisplay();
    } else {
      // stopTimer();
      selectAndStartRandomMap();
      timerSeconds = resetTime;
      updateTimerDisplay();
      showNotification('Timer finished!');

    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  resetTime = 0;  // Clear resetTime when resetting
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  document.getElementById('timerDisplay').innerHTML =
    String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}
