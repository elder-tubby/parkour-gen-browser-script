class Timer {

  constructor() {
    this.timerInterval = null;
    this.currentTimeInSeconds = 0;
    this.loopDuration = 0;
    this.timerChangeAmount = 3;
    this.chatMessage = ``;
  }
  
  increment() {
    this.currentTimeInSeconds += this.timerChangeAmount;
    this.updateDisplay();
  }

  decrement() {
    if (this.currentTimeInSeconds >= this.timerChangeAmount) {
      this.currentTimeInSeconds -= this.timerChangeAmount;
      this.updateDisplay();
    }
  }

  setLoopDuration() {
    this.loopDuration = this.currentTimeInSeconds;
  }

  start() {

    this.toggleStartAndStopButtons();

    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      if (this.currentTimeInSeconds > 0) {
        this.currentTimeInSeconds--;
        if (this.currentTimeInSeconds == 10) {
          this.chatMessage = `Next map in ${this.currentTimeInSeconds} seconds`;
          ChatManager.sendChatMessage(this.chatMessage);
        } else if (this.currentTimeInSeconds == 3 || this.currentTimeInSeconds == 2) {
          this.chatMessage = `${this.currentTimeInSeconds}`;
          ChatManager.sendChatMessage(this.chatMessage);
        } else if (this.currentTimeInSeconds == 1) {
          this.chatMessage = `${this.currentTimeInSeconds}`;
          ChatManager.sendChatMessage(this.chatMessage);
        }
        this.updateDisplay();
      } else {
        MapManager.selectAndStartRandomMap();

        NotificationManager.show('Timer finished!');
        if (this.loopDuration == 0) {
          console.log("stoppihn timer");
          this.stop();
          return;
        }

        this.currentTimeInSeconds = this.loopDuration;
        this.updateDisplay();
      }
    }, 1000);
  }

  stop() {

    this.toggleStartAndStopButtons();

    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  reset() {
    if (this.timerInterval) stop();
    this.currentTimeInSeconds = 0;
    this.loopDuration = 0;
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.currentTimeInSeconds / 60);
    const seconds = this.currentTimeInSeconds % 60;
    document.getElementById('timerDisplay').innerHTML =
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  // to toggle visibility between buttons
  toggleStartAndStopButtons() {
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
}
