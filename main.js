// player data container
// stores health, damage, money, turns taken, and levels cleared
var player = {
  // "health": 16,
  // "maxHealth": 16,
  // "dmg": 2,
  // "money": 10,
  // "turns": 0,
  // "level": 1
}

var settingsData = {
  "darkMode": false,
  "playedOnce": false,
  "version": ""
}

var version = "2017.01.16-19.50";

var cardTypes = [
  "monster", // has health, dmg, value
  "heart", // has health
  "weapon", // has dmg
  "coin" // has value
];

// data container for the three cards on screen
// 1, 2, and 3 are each card
// the sub-objects have the data values in them
// available data values are: 
//   * type
//   * health
//   * damage
//   * value
var cards = {
  1: { },
  2: { },
  3: { }
}

var patchNotes = "";

/*
  Element variables
*/

var cardContainer = document.getElementsByTagName('main')[0];
var body = document.getElementById('body');
var resetGame = document.getElementById('reset');
var menuElem = document.getElementById('menu-btn');
var menuList = document.getElementById('menu-list');
var statusBar = document.getElementById('status');
var statusHp = document.getElementById('status-hp');
var statusAtk = document.getElementById('status-atk');
var statusMoney = document.getElementById('status-money');
var statusTurns = document.getElementById('status-turns');
var statusLvl = document.getElementById('status-lvl');
var help = document.getElementById('help');
var settings = document.getElementById('settings');
var info = document.getElementById('info');


resetGame.addEventListener("click", function (event) { clearData(); init(); });
menuElem.addEventListener("click", function (event) { menuToggle(); });

var overlay = document.getElementById('overlay');
overlay.style.display = "none";
overlay.addEventListener("click", function (event) {
  if (event.target !== this) { return; }
  else { overlayToggle(); }
});

var helpText;
helpText  = "<h3>HOW TO PLAY</h3>";
helpText += "<p><b>Click on cards</b> to select which card to take.</p>";
helpText += "<p>(You can also use <b>key commands</b>: 1, 2, and 3 to select those cards, r to restart on game over)</p>";
helpText += "<ul><li><b>COINS</b> give you <b>MONEY</b></li>";
helpText += "<li><b>WEAPONS</b> increase your <b>ATK</b>, but cost the amount of <b>ATK</b> it gives</li>";
helpText += "<li><b>HEARTS</b> increase your <b>HP</b>, but cost the amount of <b>HP</b> it gives</li>";
helpText += "<li><b>MONSTERS</b> give you <b>MONEY</b>, but can hurt you for <b>HP</b></li>";
helpText += "<li><b>BOSSES</b> must be defeated to level up</li></ul>";
helpText += "<p>If your <b>HP</b> reaches zero, it's game over</p>";
helpText += "<p>Try to manage your status, as it can be easy to run out of <b>MONEY</b> or <b>HP</b></p>";
help.addEventListener("click", function (event) { overlayToggle(helpText); });

var settingsText;
settingsText  = "<h3>SETTINGS</h3>";
settingsText += "<p>No settings yet!</p>";
settings.addEventListener("click", function (event) { overlayToggle(settingsText); });

var infoText;
infoText  = "<h3>INFO</h3>";
infoText += "<p>DECK DUNGEON was made by <a href=\"https://nathanwentworth.co\" target=\"_blank\">nathan wentworth (me)</a> in the course of a week for the <a href=\"https://itch.io/jam/games-made-quick\">Games Made Quick jam</a>.</p>";
infoText += "<p>Made with basic html, css, and vanilla js. Icons and graphics made with Illustrator</p>";
infoText += "<p>Questions/Comments/Bugs? <a href=\"https://twitter.com/nathanwentworth\" target=\"_blank\">tweet at me</a>!</p>";
infoText += "<p>open source on <a href=\"https://github.com/nathanwentworth/deck-dungeon\" target=\"_blank\">github</a>, downloadable on <a href=\"https://nathanwentworth.itch.io/deck-dungeon\">itchio</a></p>";
infoText += "<p>version: 2017.01.12-20.40</p>";
info.addEventListener("click", function (event) { overlayToggle(infoText); });

var patchText;
patchText  = "<h3>PATCH NOTES</h3>";
patchText += "<p>Some things have changed in Deck Dungeon since you last played!</p>";
patchText += "<p>Balance may be a bit off, so if you're finding it too hard or too easy, let me know on twitter <a href=\"https://twitter.com/nathanwentworth\" target=\"_blank\">@nathanwentworth</a>!</p>";
patchText += "<p>changed: weapons are now additive</p>";
patchText += "<p>changed: lowered money recieved from monsters</p>";
patchText += "<p>added: notification when you level up</p>";
patchText += "<p>added: this patch note display!</p>";




window.addEventListener("keydown", function (event) {

  var cardChildren = cardContainer.childNodes;

  if (event.keyCode == 49 && !cardChildren[0].classList.contains("disabled")) {
    cardAction(null, 0);
  } else if (event.keyCode == 50 && cardChildren[1] != null && !cardChildren[1].classList.contains("disabled")) {
    cardAction(null, 1);
  } else if (event.keyCode == 51 && cardChildren[2] != null && !cardChildren[2].classList.contains("disabled")) {
    cardAction(null, 2);
  } else if (player.health == 0 && event.keyCode == 82) {
    clearData();
    init();
  }

});

window.onload = function () {
  // var titleElem = document.createElement('div');
  // var titleImg = document.createElement('img');
  // titleElem.setAttribute('class', 'game-title');
  // titleElem.textContent = "DECK DUNGEON";
  // cardContainer.appendChild(titleElem);

  statusBar.style.top = "-2em";
  menuElem.style.top = "-2em";

  setTimeout( function () {
    init();    
  }, 1450)
}

// initializes the game
var init = function () {
  // if there is player data stored in local storage, load it
  // if not, set the values as defaults
  if (localStorage.getItem('player') != null) {
    player = JSON.parse(localStorage.getItem('player'));
  } else {
    player["health"] = 16;
    player["maxHealth"] = 16;
    player["atk"] = 2;
    player["money"] = 10;
    player["turns"] = 0;
    player["level"] = 1;
  }

  if (localStorage.getItem('settingsData') != null) {
    settingsData = JSON.parse(localStorage.getItem('settingsData'));
  } else {
    overlayToggle(helpText);
    settingsData["darkMode"] = false;
    settingsData["playedOnce"] = true;
    settingsData["version"] = version;
  }

  console.log("version: " + settingsData.version);

  if (settingsData.version != version) {
    overlayToggle(patchText);
    console.log("last ran an older version: " + settingsData.version);
    console.log("current version: " + version);
    settingsData["version"] = version;
  }

  // if there is card data stored in local storage, load it
  // if not, randomize the card values
  if (localStorage.getItem('cards') != null) {
    cards = JSON.parse(localStorage.getItem('cards'));
    instantiateCards();
  } else {
    randomizeCards();
  }

  // creates randomized cards
  // displays the current player status bar
  displayStatus();

  statusBar.style.animation = "statusBarMoveDown 1s";
  menuElem.style.animation = "statusBarMoveDown 1s";
  statusBar.style.top = "16px";
  menuElem.style.top = "16px";

  // sets the flex direction of the card container
  // mainly for game resets
  cardContainer.style.flexDirection = "row";
}

// this function creates three cards
// each has random types and values
var randomizeCards = function () {
  // clears cards before making any more

  // if this value is 3, reshuffle the cards
  // this occurs when the cards can only be purchased
  // and the player doesn't have enough money to buy any of them
  var resetVal = 0;

  // this triggers boss fights
  if (player.turns % 6 == 0 && player.turns != 0) {

    var subCardData = cards[Object.keys(cards)[0]];

    subCardData["type"] = "monster";

    subCardData["health"] = (getRandomInt(24, 36) * player.level);
    subCardData["dmg"] = (getRandomInt(6, 8) * player.level);
    subCardData["value"] = (Math.ceil((subCardData["health"]) / 2));

  } else {

    for (var i = 0; i < 3; i++) {
      // get the random values for card types
      var rand = getRandomInt(0, 4);
      // get the nested objects inside the cards object
      // this is where all of the card data goes
      var subCardData = cards[Object.keys(cards)[i]];

      // sets card type
      subCardData["type"] = cardTypes[rand];

      switch (subCardData["type"]) {
        case "monster":
          subCardData["health"] = (getRandomInt(8, 20) * player.level);
          subCardData["dmg"] = (getRandomInt(4, 6) * player.level);
          subCardData["value"] = Math.ceil((subCardData["health"]) / 2);
          break;
        case "heart":
          subCardData["health"] = (getRandomInt(4, 8) * player.level);
          if (subCardData.health > player.money) {
            resetVal++;
          }
          break;
        case "weapon":
          subCardData["dmg"] = (getRandomInt(2, 4) * player.level);
          if (subCardData.dmg > player.money) {
            resetVal++;
          }
          break;
        case "coin":
          subCardData["value"] = (getRandomInt(2, 4) * player.level);
          break;
        default:
          console.log("unknown type of card! this should never happen");
      }
    }

    if (resetVal >= 3) {
      randomizeCards();
      return;
    }

    if (i == 3) {
      if (cards[Object.keys(cards)[0]].type == cards[Object.keys(cards)[1]].type && cards[Object.keys(cards)[1]].type == cards[Object.keys(cards)[2]].type) {
        randomizeCards();
        return;
      }
    }
  }




  instantiateCards();
}

// this creates the card html elements
var instantiateCards = function () {

  clearCards();

  var length;
  var boss = (player.turns % 6 == 0 && player.turns != 0) ? true : false;
  length = (boss) ? 1 : Object.keys(cards).length;

  for (var i = 0; i < length; i++) {
    var subCardData = cards[Object.keys(cards)[i]];
    var cardType = subCardData["type"];
    
    var cardElem = document.createElement('div');
    cardElem.setAttribute('class', 'card disabled');

    var cardTitle = document.createElement('div');
    cardTitle.setAttribute('class', 'card-title');
    cardTitle.textContent = (boss) ? "BOSS" : cardType;

    var cardImage = document.createElement('img');
    var imgNum = ((player.level - 1) > 7) ? 7 : (player.level - 1);
    cardImage.setAttribute('src', 'img/' + cardType + "-" + imgNum + ".png");

    cardElem.appendChild(cardTitle);
    cardElem.appendChild(cardImage);

    if (cardType == "monster") {
      var cardHealth = document.createElement('span');
      cardHealth.setAttribute('class', 'card-stat health');
      cardHealth.textContent = "HP: " + subCardData["health"];
      cardElem.appendChild(cardHealth);

      var cardDmg = document.createElement('span');
      cardDmg.setAttribute('class', 'card-stat dmg');
      cardDmg.textContent = "ATK: " + subCardData["dmg"];
      cardElem.appendChild(cardDmg);
    }
    else if (cardType == "heart") {
      var cardHealth = document.createElement('span');
      cardHealth.setAttribute('class', 'card-stat health');
      cardHealth.textContent = "HP: +" + subCardData["health"];
      cardElem.appendChild(cardHealth);

    }
    else if (cardType == "weapon") {
      var cardDmg = document.createElement('span');
      cardDmg.setAttribute('class', 'card-stat dmg');
      cardDmg.textContent = "ATK: +" + subCardData["dmg"];
      cardElem.appendChild(cardDmg);
    }
    else if (cardType == "coin") {
      var cardValue = document.createElement('span');
      cardValue.setAttribute('class', 'card-stat value');
      cardValue.textContent = "MONEY: +" + subCardData["value"];
      cardElem.appendChild(cardValue);
    }

    cardElem.addEventListener("click", function(event){ cardAction(event); });
    cardElem.style.animation = "moveCardUp 1s";
    setTimeout( function () {
      for (var i = 0; i < cardContainer.childNodes.length; i++) {
        cardContainer.childNodes[i].style.animation = null;
        cardContainer.childNodes[i].classList.remove("disabled");
      }
    }, 1100);

    cardContainer.appendChild(cardElem);
  }

  localStorage.setItem('cards', JSON.stringify(cards));
}

// this gets the card clicked, and does the related actions
var cardAction = function (event, index) {
  var target;
  var index;
  // checks initial clicked card object
  if (event != null) {
    target = event.target;
    target = findCardTarget(target);
    index = cardIndex(target);
  } else {
    index = index;
  }

  if (cardContainer.childNodes[index].classList.contains("disabled")) {
    console.log("card disabled");
    return;
  }
  
  // if the card div can't be found, this will return
  if (index == -1) {
    console.log ("error! not a card");
    console.log ("index: " + index);
    console.log ("target: " + target.nodeName);
    return;
  }

  // get the card data for the card clicked
  var card = cards[Object.keys(cards)[index]];

  console.log("card type: " + card["type"]);

  // check for card type and do actions for each
  switch (card["type"]) {
    case "monster":
      fight(card, event, index);
      break;
    case "heart":
      // hearts can only be taken by spending money equal to heart value
      if (player["money"] >= card["health"]) {
        if (player.health != player.maxHealth) {
          popupText(event, index, "+" + card["health"] + "HP -" + card["health"] + "MONEY", 1.25);
        } else {
          popupText(event, index, "+0HP -" + card["health"] + "MONEY", 1.25);
        }
        changeStat("health", card["health"]);
        changeStat("money", -card["health"]);
        setCardInactive(index);
        incrementTurn();
        setTimeout( randomizeCards, 2500);
      } else {
        setCardShake(index);
        console.log("not enough money for this heart");
      }
      break;
    case "weapon":
      // weapons can only be taken by spending money equal to damage value
      if (player["money"] >= card["dmg"]) {
        // player["atk"] = 0;
        changeStat("atk", card["dmg"]);
        changeStat("money", -card["dmg"]);
        popupText(event, index, "+" + card["dmg"] + "ATK -" + card["dmg"] + "MONEY", 1.25);
        setCardInactive(index);
        incrementTurn();
        setTimeout( randomizeCards, 2500);
      } else {
        setCardShake(index);
        console.log("not enough money for this weapon");
      }
      break;
    case "coin":
      changeStat("money", card["value"]);
      popupText(event, index, "+" + card["value"] + "MONEY", 1.25);
      setCardInactive(index);
      incrementTurn();
      setTimeout( randomizeCards, 2500);
      break;
    default:
      console.log("unknown type of card! this should never happen");
  }

  console.log(card);

  // update player status
  displayStatus();
}

// this function creates the popup text
// that shows when clicking on a card
var popupText = function (event, index, text, time) {

  var popup = document.createElement('p');
  popup.textContent = text;

  popup.style.position = "absolute";
  popup.style.animation = "popupText " + time + "s";
  if (event != null) {
    popup.style.top = event.clientY + "px";
    popup.style.left = event.clientX + "px";
  } else {
    var rect = cardContainer.childNodes[index].getBoundingClientRect();
    var width = rect.right - rect.left;
    var height = rect.bottom - rect.top;

    popup.style.top = (rect.bottom - (height / 2)) + "px";
    popup.style.left = (rect.right - (width / 2)) + "px";
  }
  popup.style.zIndex = 1000;

  body.appendChild(popup);
  console.log(text);

  setTimeout( function () {
    popup.parentElement.removeChild(popup);
  }, ((time * 1000) - 100));
}

// this runs only for monster fights
var fight = function (card, event, index) {
  var index;
  if (event != null) {
    var target = findCardTarget(event.target); 
    index = cardIndex(target);
  } else {
    index = index;
  }

  var cardNode = cardContainer.childNodes[index];
  var cardChildren = cardContainer.childNodes;

  for (var i = 0; i < cardContainer.childNodes.length; i++) {

    cardChildren[i].removeEventListener("click", function(){ cardAction(); });

    if (i != index) {
      cardChildren[i].classList.add("disabled");
      cardChildren[i].style.animation = "moveCardDown 1s";
      cardChildren[i].style.top = "100vh";
    }
  }

  var text = null;
  // player attacking
  if (getRandomInt(1, 100) > (25 * (player.health / player.maxHealth))) {
    card["health"] -= player["atk"];
    text = "MONSTER HP -" + player["atk"];
    for (var i = 0; i < cardNode.childNodes.length; i++) {
      if (cardNode.childNodes[i].className == "card-stat health") {
        cardNode.childNodes[i].textContent = "HP: " + card["health"];
        break;
      }
    }
  }

  // check of the monster is dead after the last hit
  // don't allow the monster to attack if so
  if (card["health"] <= 0) {
    setCardInactive(index);
    
    incrementTurn();

    if (player.turns % 6 == 1 && player.turns != 1) {
      setTimeout( randomizeCards, 3500);
    } else {
      setTimeout( randomizeCards, 1500);
    }

    cardNode.style.animation = "moveCardDown 1s";
    cardNode.style.top = "100vh";
    player["money"] += card["value"];
    text = "MONSTER DEFEATED, MONEY +" + card["value"];


    popupText(event, index, text, 3);
    return;
  }

  // monster attacking
  if (getRandomInt(1, 100) < 75) {
    player["health"] -= card["dmg"];
    if (text == null) {
      text = "PLAYER HP -" + card["dmg"];
    } else {
      text += " PLAYER HP -" + card["dmg"];
    }
  }


  if (text == null) {
    text = "MISS!";
  }

  popupText(event, index, text, 1.75);
}

var changeStat = function (type, value) {
  if (type == "health") {
    if ((value + player.health) > player.maxHealth) {
      player.health = player.maxHealth;
      return;
    }
  }

  player[type] += value;
}

var menuToggle = function () {
  menuList.style.display = (menuList.style.display == "none") ? "initial" : "none";
}

var overlayToggle = function (text) {
  if (overlay.style.display == "none") {
    overlay.style.display = "flex";

    if (text != null) {
      overlay.childNodes[1].innerHTML = text;
    }

  } else {
    overlay.style.display = "none";
  }
}

var setCardInactive = function (index) {

  var cardChildren = cardContainer.childNodes;


  if (index == -1) {
    for (var i = 0; i < cardChildren.length; i++) {
      cardChildren[i].classList.add("disabled");
      cardChildren[i].style.animation = "moveCardDown 1s";
      cardChildren[i].style.top = "100vh";      
    }
  } else {
    for (var i = 0; i < cardChildren.length; i++) {

      cardChildren[i].removeEventListener("click", function(){ cardAction(); });
      console.log("event listener removed");
      cardChildren[i].classList.add("disabled");

      if (i != index) {
        cardChildren[i].style.animation = "moveCardDown 1s";
        cardChildren[i].style.top = "100vh";
      }
    }
    setTimeout( function () {
      cardChildren[index].style.animation = "moveCardDown 1s";
      cardChildren[index].style.top = "100vh";
    }, 1500);
  }
  // target.style.animation = "moveCardDown 1s";
  // target.style.top = "100vh";
}

var setCardShake = function (index) {
  cardContainer.childNodes[index].style.animation = "cardShake 0.5s";
  setTimeout( function () {
    cardContainer.childNodes[index].style.animation = null;
  }, 550);
}

var cardIndex = function (target) {
  if (target.parentElement.nodeName == "MAIN") {
    var index = 0;
    while ( (target = target.previousSibling) != null ) {
      index++;
    }
  }
  return index;
}

var findCardTarget = function (target) {
  console.log("checking element " + target.nodeName);
  if (target.parentElement.nodeName != "MAIN") {
    if (target.parentElement != null) {
      console.log ("parent element isn't MAIN, it's " + target.parentElement.nodeName);
      target = target.parentElement;
      return findCardTarget(target);
    } else {
      console.log ("couldn't find main element!");
      return target;
    }
  }
  return target;
}

var clearCards = function () {
  while (cardContainer.childNodes[0] != null) {
    cardContainer.removeChild(cardContainer.childNodes[0]);
  }
}

var incrementTurn = function () {
  player.turns++;
  if (player.turns % 6 == 1 && player.turns != 1) {
    player.level++;
    player.maxHealth = player.level * 16;
    player.health += 16;

    setTimeout( function () {
      var levelUpText = document.createElement("p");
      levelUpText.textContent = "LEVEL UP! +16 MAX HP";
      levelUpText.classList.add("level-up");

      cardContainer.appendChild(levelUpText);

    }, 1500);

  }
}

var displayStatus = function () {
  localStorage.setItem('player', JSON.stringify(player));
  localStorage.setItem('settingsData', JSON.stringify(settingsData));

  statusHp.style.color = (player.health <= (0.25 * player.maxHealth)) ? "#ff0000" : "#28364f";

  statusHp.textContent = "HP: " + player["health"] + "/" + player["maxHealth"];
  statusAtk.textContent = "ATK: " + player["atk"];
  statusMoney.textContent = "MONEY: " + player["money"];
  statusTurns.textContent = "TURNS: " + player.turns;
  statusLvl.textContent = "LVL: " + player.level;

  if (player.health <= 0) {
    gameOver();
  }
}

var clearData = function () {
  localStorage.removeItem('player');
  localStorage.removeItem('cards');
}

var resetSettings = function () {
  localStorage.removeItem('settingsData');
}

var gameOver = function () {
  player.health = 0;
  console.log ("game over! score was " + ((player.health + player.atk + player.money) * player.level));
  setCardInactive(-1);

  setTimeout( function () {
    clearCards();
    var gameOverTitle = document.createElement('p');
    var gameOverStats = document.createElement('p');
    var restartButton = document.createElement('p');

    gameOverTitle.textContent = "GAME OVER";
    gameOverStats.textContent = "FINAL SCORE: " + ((player.health + player.atk + player.money) * player.level);
    restartButton.textContent = "PLAY AGAIN";

    restartButton.addEventListener("click", function() { clearData(); init(); });

    restartButton.classList.add("btn");
    restartButton.classList.add("restart");

    cardContainer.style.flexDirection = "column";

    cardContainer.appendChild(gameOverTitle);
    cardContainer.appendChild(gameOverStats);
    cardContainer.appendChild(restartButton);
  }, 1500);

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
