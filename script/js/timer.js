let timerInterval = null;
let timerSeconds = 0;
let resetTime = 0; // Stores the value of 'x' when timer hits 0

function incrementTimer() {
  timerSeconds += 10;
  updateTimerDisplay();
}

function decrementTimer() {
  if (timerSeconds >= 10) {
    timerSeconds -= 10;
    updateTimerDisplay();
  }
}

function startTimer() {
  if (timerInterval) return;
  resetTime = timerSeconds;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      if (timerSeconds < 9) {
        const chatMessage = `Next map in ${timerSeconds} seconds.`;
        console.log(chatMessage);
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
