class TimerUI {
    constructor(container) {
      this.container = container;
      this.timer = new Timer();
      this.init();
    }
  
    init() {
      const timerDisplay = this.createTimerDisplay();
      const timerButtonContainer = this.createTimerChangeContainer();
      const timerOptionsContainer = this.createTimerOptionsContainer();
  
      this.container.appendChild(timerDisplay);
      this.container.appendChild(timerButtonContainer);
      this.container.appendChild(timerOptionsContainer);
    }
  
    createTimerDisplay() {
      const timerDisplay = document.createElement('div');
      timerDisplay.id = 'timerDisplay';
      timerDisplay.classList.add('timer-display');
      timerDisplay.innerHTML = '00:00';
      return timerDisplay;
    }
  
    createTimerChangeContainer() {
      const container = document.createElement('div');
      container.classList.add('timer-change-container');
  
      const incrementButton = UIFactory.createStyledButton(`+${this.timer.timerChangeAmount} Sec`, () => this.timer.increment(), true);
      const decrementButton = UIFactory.createStyledButton(`-${this.timer.timerChangeAmount} Sec`, () => this.timer.decrement(), true);
      incrementButton.style.width = '70px';
      decrementButton.style.width = '70px';
  
      container.appendChild(incrementButton);
      container.appendChild(decrementButton);
  
      return container;
    }
  
    createTimerOptionsContainer() {
      const innerContainer = document.createElement('div');
      innerContainer.classList.add('timer-start-stop-container');
  
      const startButton = UIFactory.createStyledButton('Start', () => this.timer.start(), false, 'startButton');
      const stopButton = UIFactory.createStyledButton('Pause', () => this.timer.stop(), false, 'stopButton');
      stopButton.style.display = 'none'; // Initially hide the stop button
  
      const resetButton = UIFactory.createStyledButton('Reset', () => this.timer.reset());
  
      const setLoopDurationButton = UIFactory.createStyledButton('Set current time as loop duration', () => this.timer.setLoopDuration());
      setLoopDurationButton.classList.add('set-loop-duration-button');
  
      innerContainer.appendChild(startButton);
      innerContainer.appendChild(stopButton);
      innerContainer.appendChild(resetButton);
  
      const outerContainer = document.createElement('div');
      outerContainer.appendChild(innerContainer);
      outerContainer.appendChild(setLoopDurationButton);
  
      return outerContainer;
    }
  }
  