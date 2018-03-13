/*
 * Create a list that holds all of your cards
 * Build card array holding the names of 16 cards.
 */
const cardArray = [
  'anchor', 'bolt', 'cube', 'diamond', 'paper-plane-o',
  'leaf', 'bicycle', 'bomb', 'diamond', 'paper-plane-o',
  'anchor', 'bolt', 'bomb', 'cube', 'bicycle', 'leaf'
];

let cardState = []; // track if a card is open or not

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function loadBoard(cardArray) {
  const docFrag = document.createDocumentFragment();
  const deck = document.querySelector('.deck');
  cardArray.forEach((card, index) => {
    const cardContainer = document.createElement('div');
  cardContainer.className = 'cardContainer';

  const cardDiv = document.createElement('div');
  cardDiv.className = 'card hide';
  cardDiv.dataset.cardname = card;
  cardDiv.dataset.index = index;
  cardContainer.appendChild(cardDiv);

  const front = document.createElement('div');
  front.className = 'front';
  cardDiv.appendChild(front);

  const i = document.createElement('i');
  i.classList.add('fa');
  i.classList.add('fa-' + card);
  front.appendChild(i);

  const back = document.createElement('div');
  back.className = 'back';
  cardDiv.appendChild(back);

  docFrag.appendChild(cardContainer);
});

  deck.innerHTML = '';
  deck.appendChild(docFrag);
  cardState = cardArray.map((card) => {
    return false;
});
}

const ANIMATING = 'animating';
const MATCH = 'match';
const HIDE = 'hide';

/**
 * call this after we know the board is loaded
 */
function addEvents() {
  $('.deck').on('click', '.card', function (e) {

    const card = e.currentTarget;
    if (card.classList.contains(ANIMATING) || card.classList.contains(MATCH)) {
      return;
    }

    card.classList.add(ANIMATING);
    const isViewingCard = card.classList.contains(HIDE);
    const cardIndex = card.dataset.index;
    const cardName = card.dataset.cardname;
    const visibleCards = cardState.map((isCheckingForMatch, index) => {
      return {
        isCheckingForMatch,
        index
      };
  }).filter((info) => {
      return info.isCheckingForMatch;
  });

    if (isViewingCard) {
      // if 2 cards are already open don't allow the 3rd to open
      if (visibleCards.length == 2) {
        card.classList.remove(ANIMATING);
        return;
      }
      // mark the card state as visible
      cardState[cardIndex] = true;
      // show the card
      card.classList.remove(HIDE);

      // check for matches
      if (visibleCards.length == 1) {
        const cardDivs = document.querySelectorAll('.card');
        const otherCard = cardDivs[visibleCards[0].index];
        if (otherCard.dataset.cardname == cardName) {
          card.classList.add(MATCH);
          // find the other card and add match class
          otherCard.classList.add(MATCH);

          cardState[cardIndex] = false;
          cardState[visibleCards[0].index] = false;
        } else {
          // if we didn't have a match then hide the cards
          otherCard.classList.add(ANIMATING);
          window.setTimeout(() => {
            otherCard.classList.add(HIDE);
          card.classList.add(HIDE);
          otherCard.classList.remove(ANIMATING);
          card.classList.remove(ANIMATING);
          cardState[cardIndex] = false;
          cardState[visibleCards[0].index] = false;

        }, 1000);
          return;
        }
      }
    } else {
      cardState[cardIndex] = false;
      card.classList.add(HIDE);
    }

    window.setTimeout(() => {
      card.classList.remove(ANIMATING);
  }, 1000);
  });
}


function startGame() {
  console.log("Let's flip some cards.");
  shuffle(cardArray);
  loadBoard(cardArray);
  console.log("Shuffled items: " + cardArray);
  addEvents();
}

//Wait for html page to load before starting the game.
window.onload = function () {
  startGame();
};
