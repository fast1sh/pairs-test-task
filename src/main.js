class PairsGame {
  constructor() {
    //UI
    this.cardsContainer = document.querySelector('.container');
    this.startButton = document.querySelector('.start-button');
    this.timerMinutesSpan = document.querySelector('.timer-minutes');
    this.timerSecondsSpan = document.querySelector('.timer-seconds');
    this.timerMillisecondsSpan = document.querySelector('.timer-milliseconds');
    //card colors
    this.cards = ['red', 'green', 'blue', 'orange', 
                  'yellow', 'purple', 'gray', 'aqua'];
    //timer
    this.timerMinutes = 0;
    this.timerSeconds = 0;
    this.timerMilliseconds = 0;
    this.timerInterval;
    //array of opened cards to check if the choice is right
    this.choicesArray = [];
    //counter of right guesses to know when to stop the game
    this.rightGuessesCounter = 0;
    //method binds
    this.onCardClick = this.onCardClick.bind(this);
  }
  /**
   * 
   * @param {Array} cards 
   */
  shuffleCards(cards) {
    //colors duplication
    const clone = cards.slice();
    const newCards = clone.reduce((acc, current) => {
      acc.push(current, current);
      return acc;
    }, []);

    for (let i = newCards.length - 1; i > 0; i -= 1) {
      // random index from 0 to i
      let j = Math.floor(Math.random() * (i + 1));

      // swap elements
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]]; 
    }
    
    return newCards;
  }
  /**
   * 
   * @param {Array} cards 
   */
  renderCards(cards) {
    if (cards.length === 0) {
      return;
    }

    const [currentCard, ...rest] = cards;

    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = currentCard;

    card.addEventListener('click', () => {
      //to prevent multiple clicks
      if (!card.classList.contains(currentCard)) {
        this.onCardClick(card)
      }
    });

    this.cardsContainer.appendChild(card);

    return this.renderCards(rest);
  }
  /**
   * 
   * @param {Object} card 
   */
  onCardClick(card) {
    //add color to card
    card.classList.add(card.dataset.name);

    this.choicesArray.push(card);

    if (this.choicesArray.length > 1) {
      this.checkCards(this.choicesArray);
    }
  }
  /**
   * 
   * @param {Array} cards 
   */
  checkCards(cards) {

    if (cards[0].dataset.name === cards[1].dataset.name) {
      this.rightGuessesCounter += 1;

      if (this.rightGuessesCounter === 8) {
        this.stopGame();
      }
    } else {
      cards.forEach((card) => {
        setTimeout(() => {
          //remove color
          card.classList.remove(card.dataset.name);
        }, 500);
      });
    }

    this.choicesArray = [];
  }
  /**
   * 
   * @param {Object} startTime 
   */
  timerHandler(startTime) {
    //to get rid of time offset
    const timeDelta = new Date() - startTime;

    this.timerMinutes = new Date(timeDelta).getMinutes();
    this.timerSeconds = new Date(timeDelta).getSeconds();
    this.timerMilliseconds = new Date(timeDelta).getMilliseconds();

    this.timerMillisecondsSpan.innerHTML = this.timerMilliseconds;
    //add leading zeros if needed
    if (this.timerSeconds <= 9) {
      this.timerSecondsSpan.innerHTML = `0${this.timerSeconds}`;
    }

    if (this.timerSeconds > 9) {
      this.timerSecondsSpan.innerHTML = this.timerSeconds;
    }

    if (this.timerMinutes <= 9) {
      this.timerMinutesSpan.innerHTML = `0${this.timerMinutes}`;
    }

    if (this.timerMinutes > 9) {
      this.timerMinutesSpan.innerHTML = this.timerMinutes;
    }
  }

  startTimer() {
    const startTime = new Date();

    this.timerInterval = setInterval(() => {
      this.timerHandler(startTime);
    }, 50);

    this.startButton.disabled = true;
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  startGame() {
    const shuffledCards = this.shuffleCards(this.cards);
    this.renderCards(shuffledCards);
    this.startTimer();
  }

  stopGame() {
    //get properly formatted time
    const minutes = this.timerMinutesSpan.innerHTML;
    const seconds = this.timerSecondsSpan.innerHTML;
    const milliseconds = this.timerMillisecondsSpan.innerHTML;
    const finalTime = `${minutes}:${seconds}.${milliseconds}`;

    this.stopTimer();

    alert(`Вы выиграли!\nЗатраченное время: ${finalTime}`);
  }
}

//UI
const cardsContainer = document.querySelector('.container');
const startButton = document.querySelector('.start-button');

//render empty cards grid
const renderEmptyCards = () => {
  for (let i = 0; i < 16; i += 1) {
    const card = document.createElement('div');
    card.classList.add('card');
    cardsContainer.appendChild(card);
  }
};

const clearEmptyCards = () => cardsContainer.innerHTML = '';

renderEmptyCards();

//event listeners
startButton.addEventListener('click', () => {
  clearEmptyCards();
  const game = new PairsGame();
  game.startGame();
});