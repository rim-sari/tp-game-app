const startButton = document.getElementById("startButton");
const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell]");
const winningMessage = document.getElementById("winningMessage");
const winningMessageText = document.getElementById("winningMessageText");
const restartButton = document.getElementById("restartbutton");

let currentPlayer = "X"; // Joueur X commence toujours
let boardState = Array(9).fill(null); // État initial du plateau (vide)
let player1 = "";
let player2 = "";
let scores = { X: 0, O: 0 }; // Scores des joueurs

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Fonction appelée lors du clic sur le bouton "Démarrer"
function startGame() {
  const player1Input = document.getElementById("player1").value.trim();
  const player2Input = document.getElementById("player2").value.trim();
  const errorMessage = document.getElementById("error-message");

  // Vérifie si les noms des joueurs ont été saisis
  if (!player1Input || !player2Input) {
    errorMessage.classList.remove("hidden");
    return;
  }

  // Cache le message d'erreur, sauvegarde les noms, et met à jour l'affichage
  errorMessage.classList.add("hidden");
  player1 = player1Input;
  player2 = player2Input;

  document.querySelector(".player-inputs").classList.add("hidden"); // Cache les champs de saisie
  document.getElementById("scores").classList.remove("hidden"); // Affiche les scores
  board.classList.remove("hidden"); // Affiche le plateau

  updateScores(); // Met à jour l'affichage des scores
}

// Met à jour l'affichage des scores et vérifie si un joueur a gagné 3 parties
function updateScores() {
  const scoreDisplay = document.getElementById("scores");
  scoreDisplay.innerHTML = `
  <p>${player1} (X) : ${scores.X}</p>
  <p>${player2} (O) : ${scores.O}</p>
`;


  // Vérifie si un joueur a atteint 3 victoires
  if (scores.X === 3) {
    endGameGlobal(player1); // Joueur 1 a gagné la partie globale
  } else if (scores.O === 3) {
    endGameGlobal(player2); // Joueur 2 a gagné la partie globale
  }
}

// Gère le clic sur une case
function handleClick(e) {
  const cell = e.target;
  const cellIndex = Array.from(cells).indexOf(cell);

  // Empêche de jouer dans une case déjà occupée ou après une victoire
  if (boardState[cellIndex] || !winningMessage.classList.contains("hidden")) {
    return;
  }

  // Met à jour l'état du plateau
  boardState[cellIndex] = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.textContent = currentPlayer;

  // Vérifie si le joueur actuel a gagné
  if (checkWin(currentPlayer)) {
    scores[currentPlayer]++; // Met à jour le score du gagnant
    endGame(false); // Fin du jeu (pas un match nul)
  } else if (boardState.every(cell => cell)) {
    endGame(true); // Match nul
  } else {
    // Change le joueur actif
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

// Vérifie si un joueur a gagné
function checkWin(player) {
  return winningCombinations.some(combination =>
    combination.every(index => boardState[index] === player)
  );
}

// Affiche le message de fin de partie (une manche)
function endGame(draw) {
  winningMessage.classList.remove("hidden");
  if (draw) {
    winningMessageText.textContent = "Match nul !";
  } else {
    winningMessageText.textContent = `${
      currentPlayer === "X" ? player1 : player2
    } a gagné cette manche !`;
    updateScores(); // Met à jour les scores
  }
}

// Affiche le message de fin de partie globale
function endGameGlobal(winner) {
  const globalWinningMessage = document.getElementById("globalWinningMessage");
  const globalWinningMessageText = document.getElementById("globalWinningMessageText");
  const globalRestartButton = document.getElementById("globalRestartButton");
  const overlay = document.getElementById("overlay");

  // Affiche le message et l'overlay
  globalWinningMessage.classList.remove("hidden");
  overlay.classList.remove("hidden");
  globalWinningMessageText.textContent = `${winner} a gagné la partie !`;

  // Ajoute un gestionnaire pour le bouton rejouer
  globalRestartButton.addEventListener("click", () => {
    globalWinningMessage.classList.add("hidden");
    overlay.classList.add("hidden");
    resetGameGlobal(); // Réinitialise la partie complète
  });
}



// Réinitialise la partie complète
function resetGameGlobal() {
  scores = { X: 0, O: 0 }; // Réinitialise les scores
  restartGame(); // Réinitialise le plateau
  document.querySelector(".player-inputs").classList.remove("hidden"); // Affiche les champs de saisie
  document.getElementById("scores").classList.add("hidden"); // Cache les scores
  board.classList.add("hidden"); // Cache le plateau
}

// Réinitialise le plateau pour une nouvelle manche
function restartGame() {
  boardState.fill(null); // Réinitialise l'état du plateau
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
  currentPlayer = "X"; // Réinitialise le joueur actuel
  winningMessage.classList.add("hidden"); // Cache le message de fin
}

// Ajout des gestionnaires d'événements
startButton.addEventListener("click", startGame);
cells.forEach(cell => cell.addEventListener("click", handleClick));
restartButton.addEventListener("click", restartGame);
