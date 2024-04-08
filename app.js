import Player from "./Player.js";

// dom elements
let boardEl = document.querySelector("[data-board]");
let diceRollerEl = document.querySelector("[data-dice-roller");
let diceValueEl = document.querySelector("[data-dice-value");
let msgEl = document.querySelector("[data-msg-el]")

// normal single variables
let playerOne, playerTwo;
let playWithBot;

//arrays
let paths = [];
let boostPathsIndex = [3, 7, 20, 25, 70, 79];
let boostedPathsIndex = [15, 29, 41, 73, 91, 98];
let dangerPathsIndex = [34, 38, 47, 61, 87, 93, 95];
let dangerSentPathsIndex = [5, 9, 26, 13, 23, 72, 54];

// booleans
let diceIsRolling = false
let canRollDice = false
let playerOneTurn = true
let gameHasEnded = false

// functions
let createPaths = () => {
    // create cells dom elements, push them into an array(cellsArray), append them to the board dom element
    for (let i = 0; i < 100; i++) {
        let pathEl = document.createElement("div")
        pathEl.classList.add("path")
        paths.push(pathEl)
        boardEl.appendChild(pathEl)
    }
}

let createPlayers = () => {
    
    // create and append players dom elements to the board dom element
    for (let i = 0; i < 2; i++) {
        let playerEl = document.createElement("div")
        playerEl.classList.add(`player${i + 1}`)
        playerEl.setAttribute("id",`player${i + 1}`)
        playerEl.classList.add("player") 
        paths[0].appendChild(playerEl)
    }

    // set player variables to their Classes
    playerOne = new Player(document.getElementById("player1"), 0, false)
    playerTwo = new Player(document.getElementById("player2"), 0, false)
}

let displayTurnMsg = () => {
    let num = playerOneTurn ? "one" : "two"
    msgEl.firstChild.innerText = `It's Player ${num} turn`
    msgEl.parentElement.style.display = "flex"
}

let sendPlayerHome = () => {
    if (playerOne.pathIndex === playerTwo.pathIndex) {
        let playerClass = playerOneTurn ? playerOne : playerTwo
        playerClass.pathIndex = 0;
        playerClass.appendPlayerEl(paths)
    }
}

let swapTurn = () => {
    playerOneTurn = !playerOneTurn
    displayTurnMsg()
    diceRollerEl.style.backgroundColor = playerOneTurn ? "blue" : "green"
}

let endGame = () => {
    gameHasEnded = true
    let num = playerOneTurn ? "one" : "two"
    msgEl.firstChild.innerText = `Congrats, player ${num} is the winner!`
    let btnEl = document.createElement("button")
    btnEl.innerText = "Restart Game"
    btnEl.type = "button"
    msgEl.append(btnEl)
    msgEl.parentElement.style.display = "flex"
}

let startGame = () => {
    msgEl.innerHTML = ""
    let pEl = document.createElement("p")
    pEl.innerText = "Do you want to play with computer?"
    let divEl = document.createElement("div")
    let btnOne = document.createElement("button")
    let btnTwo = document.createElement("button")
    btnOne.type = "button"
    btnTwo.type = "button"
    btnOne.innerText = "Yes"
    btnTwo.innerText = "No"
    divEl.appendChild(btnOne)
    divEl.appendChild(btnTwo)
    msgEl.appendChild(pEl)
    msgEl.appendChild(divEl)
    msgEl.parentElement.style.display = "flex"
    diceIsRolling = false
    canRollDice = false
    playerOneTurn = true
    gameHasEnded = false
    // set player variables to their Classes
    playerOne = new Player(document.getElementById("player1"), 0, false)
    playerTwo = new Player(document.getElementById("player2"), 0, false)
    playerOne.appendPlayerEl(paths)
    playerTwo.appendPlayerEl(paths)
}

let rollDice = () => {
    if (!diceIsRolling && canRollDice  && !gameHasEnded) {
        let diceNumber;
        let diceInterval;
        // generate dice value and insert it into the dom element(diceValueEl)
        diceInterval = setInterval(() => {
            diceNumber = Math.floor( Math.random() * 6 ) + 1
            diceValueEl.innerText = diceNumber
            diceIsRolling = true
            canRollDice = false
        }, 10)   
        
        setTimeout(() => {

            // stop rolling the dice and give a precise value, change turn, show 'next player' msg on screen
            clearInterval(diceInterval)
            let playerClass = playerOneTurn ? playerOne : playerTwo
            if (diceNumber + playerClass.pathIndex > 99) {
                diceNumber = 100 - playerClass.pathIndex
            }
            let timeout = (diceNumber * 700) + 1200

            setTimeout(() => {
                diceValueEl.innerText = ""
                if (playerOne.hasWon || playerTwo.hasWon) {
                    endGame()
                } else {
                    swapTurn()
                    sendPlayerHome()
                }

                setTimeout(() => {
                    if (!gameHasEnded) {
                        msgEl.parentElement.style.display = "none"
                        canRollDice = true
                        diceIsRolling = false
                        setTimeout(() => {
                            if (!playerOneTurn && playWithBot) {
                                rollDice()
                            }
                        }, 1000); 
                    }                   
                }, 500);
            }, timeout);

            // update the current player location
            playerClass.updatePlayerLocation(
                diceNumber, 
                paths, 
                dangerPathsIndex,
                dangerSentPathsIndex, 
                boostPathsIndex, 
                boostedPathsIndex, 
            )

        }, 2000);
    }    
}
// =================================================================


// run functions and eventListeners
createPaths()
createPlayers()
diceRollerEl.addEventListener("click", rollDice)
msgEl.addEventListener("click", (e) => {
    let target = e.target

    function clearMsgEL() {
        msgEl.parentElement.style.display = "none"
        msgEl.innerHTML = ""
    }

    function proceedGame() {
        setTimeout(() => {
            let pEl = document.createElement("p")
            let num = playerOneTurn ? "one" : "two"
            pEl.innerText = `It's Player ${num} turn`
            msgEl.append(pEl)
            msgEl.parentElement.style.display = "flex"
    
            setTimeout(() => {
                msgEl.parentElement.style.display = "none"
                canRollDice = true
            }, 1500);
        }, 700);
    }

    if (target.innerText === "Yes") {
        playWithBot = true
        clearMsgEL()
        proceedGame()
    } else if (target.innerText === "No") {
        playWithBot = false
        clearMsgEL()
        proceedGame()
    } else if (target.innerText === "Restart Game") {
        startGame()
    }
    
})
