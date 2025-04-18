document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");
  const rollBtn = document.getElementById("rollBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const diceImage = document.getElementById("diceImage");
  const winnerMessage = document.getElementById("winnerMessage");
  const roundDisplay = document.getElementById("round");
  const playNextRoundBtn = document.getElementById("playNextRoundBtn");
  const playerOnePoints = document.getElementById("playerOnePoints");
  const playerTwoPoints = document.getElementById("playerTwoPoints");
  const playerScores = document.getElementById("playerScores");
  const diceRollSound = document.getElementById("diceRollSound");
  const winSound = document.getElementById("winSound");

  // Game state
  const gameState = {
    currentPlayer: 1,
    winner: null,
    round: 1,
    wins: [0, 0],
    maxRounds: 3,
    winningScore: 2,
    isRolling: false
  };

  // Event listeners
  rollBtn.addEventListener("click", rollDice);
  playAgainBtn.addEventListener("click", playAgain);
  playNextRoundBtn.addEventListener("click", playNextRound);

  // Initialize game
  updateScoreDisplay();
  highlightCurrentPlayer();

  function rollDice() {
    if (gameState.winner || gameState.isRolling) return;
    
    gameState.isRolling = true;
    rollBtn.disabled = true;
    
    // Animate dice roll
    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      const tempValue = Math.floor(Math.random() * 6) + 1;
      diceImage.src = `./assets/dice-${tempValue}.png`;
      diceImage.classList.add("rolling");
      
      if (diceRollSound) {
        diceRollSound.currentTime = 0;
        diceRollSound.play();
      }
      
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        completeDiceRoll();
      }
    }, 100);
  }

  function completeDiceRoll() {
    // Final dice value
    const diceValue = Math.floor(Math.random() * 6) + 1;
    diceImage.src = `./assets/dice-${diceValue}.png`;
    diceImage.classList.remove("rolling");
    gameState.isRolling = false;
    rollBtn.disabled = false;

    // Check for winning roll
    if (diceValue === 6) {
      gameState.winner = gameState.currentPlayer;
      gameState.wins[gameState.winner - 1]++;
      
      if (winSound) {
        winSound.currentTime = 0;
        winSound.play();
      }

      // Update UI for round win
      updatePointsFun();
      
      if (gameState.wins[0] >= gameState.winningScore || gameState.wins[1] >= gameState.winningScore) {
        checkWinnerFun();
      } else if (gameState.round < gameState.maxRounds) {
        winnerMessage.textContent = `Player ${gameState.winner} won Round ${gameState.round} 🔥`;
        winnerMessage.classList.add("win-animation");
        playNextRoundBtn.style.display = "flex";
        rollBtn.style.display = "none";
        gameState.round++;
      }
    } else {
      // Switch player
      gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
      highlightCurrentPlayer();
    }
    
    // Update score display
    updateScoreDisplay();
  }

  function highlightCurrentPlayer() {
    player1.classList.toggle("active-player", gameState.currentPlayer === 1);
    player2.classList.toggle("active-player", gameState.currentPlayer === 2);
  }

  function updateScoreDisplay() {
    document.getElementById("player1Score").textContent = gameState.wins[0];
    document.getElementById("player2Score").textContent = gameState.wins[1];
  }

  function updatePointsFun() {
    const winnerIndex = gameState.winner - 1;
    const loserIndex = 1 - winnerIndex;
    const roundIndex = gameState.round - 1;
    
    const pointElements = [playerOnePoints.children, playerTwoPoints.children];
    
    pointElements[winnerIndex][roundIndex].textContent = "✔️";
    pointElements[loserIndex][roundIndex].textContent = "❌";
    
    pointElements[winnerIndex][roundIndex].classList.add("win-point");
    pointElements[loserIndex][roundIndex].classList.add("lose-point");
  }

  function resetPoints() {
    for (let i = 0; i < gameState.maxRounds; i++) {
      for (const pointsContainer of [playerOnePoints, playerTwoPoints]) {
        pointsContainer.children[i].textContent = "";
        pointsContainer.children[i].className = "point";
      }
    }
  }

  function checkWinnerFun() {
    updatePointsFun();
    playAgainBtn.style.display = "flex";
    rollBtn.style.display = "none";
    
    const winnerIndex = gameState.wins[0] >= gameState.winningScore ? 0 : 1;
    winnerMessage.innerHTML = `Player ${winnerIndex + 1} won the game 🏆`;
    winnerMessage.classList.add("game-win-animation");
  }

  function playNextRound() {
    roundDisplay.textContent = " " + gameState.round;
    gameState.winner = null;
    playNextRoundBtn.style.display = "none";
    rollBtn.style.display = "flex";
    winnerMessage.textContent = "";
    winnerMessage.className = "";
    highlightCurrentPlayer();
  }

  function playAgain() {
    gameState.winner = null;
    gameState.currentPlayer = 1;
    gameState.wins = [0, 0];
    gameState.round = 1;
    
    playAgainBtn.style.display = "none";
    rollBtn.style.display = "flex";
    winnerMessage.textContent = "";
    winnerMessage.className = "";
    roundDisplay.textContent = " " + gameState.round;
    
    resetPoints();
    updateScoreDisplay();
    highlightCurrentPlayer();
  }
});
