let timerInterval = null;
let timerSeconds = 0;

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
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        stopTimer();
        showNotification('Timer finished!');
        // selectRandomMap();
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
    updateTimerDisplay();
  }
  
  function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timerDisplay').innerHTML =
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }
  