import { Player } from './player.js';

export const game = (function () {
  const rows = 3;

  let symbolsUsed;
  let player1;
  let player2;

  let gameBoard = (function () {
    let board = null;

    function resetBoard() {
      symbolsUsed = 0;
      board = null;

      board = Array.from({ length: 3 }, () => new Array(3).fill(null));
      return board;
    }

    function boardCopy() {
      let copyOfTheBoard = new Array(rows);

      for (let i = 0; i < rows; i++) {
        copyOfTheBoard[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
          copyOfTheBoard[i][j] = board[i][j];
        }
      }

      return [copyOfTheBoard, symbolsUsed];
    }

    function checkWinner() {
      console.log(board);

      let wins = [
        //rows
        [
          [0, 0],
          [0, 1],
          [0, 2],
        ],
        [
          [1, 0],
          [1, 1],
          [1, 2],
        ],
        [
          [2, 0],
          [2, 1],
          [2, 2],
        ],
        //columns
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        [
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        [
          [0, 2],
          [1, 2],
          [2, 2],
        ],
        //diagonals
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
        [
          [2, 0],
          [1, 1],
          [0, 2],
        ],
      ];
      for (let i = 0; i < wins.length; i++) {
        let [a, b, c] = wins[i];

        const x = board[a[0]][a[1]];
        const y = board[b[0]][b[1]];
        const z = board[c[0]][c[1]];

        if (x && x === y && y === z) {
          let type;
          let lineType;

          if (i < 3) {
            type = 'row';
            lineType = i;
          } else if (i < 6) {
            type = 'col';
            lineType = i % 3;
          } else if (i == 7) {
            type = 'diag';
            lineType = 1;
          } else {
            type = 'diag';
            lineType = 2;
          }

          return [type, lineType, x];
        }
      }

      if (symbolsUsed === 9) {
        console.log('Draw');
        return 1;
      }

      return null;
    }

    function addSymbol(symbol, position) {
      if (board[position[0]][position[1]] != null) return false;
      else {
        board[position[0]][[position[1]]] = symbol;
        symbolsUsed++;
        return true;
      }
    }

    function checkSymbol(symbol, position) {
      if (board[position[0]][position[1]] != null) return false;
      else {
        return true;
      }
    }

    return { checkWinner, addSymbol, resetBoard, checkSymbol, boardCopy };
  })();

  function startGame() {
    gameBoard.resetBoard();

    player1 = Player(1);
    player2 = Player(2);

    symbolsUsed = 0;
  }

  function getPlayerDetails(symbol) {
    return symbol === player1.symbol ? [player1, 1] : [player2, 2];
  }

  function getSymbolsUsed() {
    return symbolsUsed;
  }

  const botLogic = (function () {
    let boardCopy = new Array(rows);
    let symbolsUsed;

    for (let i = 0; i < rows; i++) {
      boardCopy[i] = new Array(rows);
    }

    function easyBot(symbol) {
      while (true) {
        const randomPosition = [
          Math.floor(Math.random() * rows),
          Math.floor(Math.random() * rows),
        ];

        if (gameBoard.checkSymbol(symbol, randomPosition))
          return randomPosition;
      }
    }

    function normalBot(symbol) {
      const randomPath = Math.random();

      if (randomPath < 0.5) {
        // check if the bot has an winning opportunity
        [boardCopy, symbolsUsed] = gameBoard.boardCopy();
        const potentialPosition = checkBoard(symbol);

        if (potentialPosition) return potentialPosition;

        return easyBot(symbol);
      }

      return hardBot(symbol);
    }

    function hardBot(symbol) {
      [boardCopy, symbolsUsed] = gameBoard.boardCopy();

      return searchBestMove(symbol, minimax);
    }

    function searchBestMove(botSymbol, callback) {
      let bestScore = -Infinity;
      let move = null;
      let playerSymbol = botSymbol === 'X' ? 'O' : 'X';

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
          if (boardCopy[i][j] === null) {
            addSymbol(botSymbol, [i, j]);
            let score;

            if (callback === minimax)
              score = callback(playerSymbol, botSymbol, false, 0);
            else score = callback();

            removeSymbol([i, j]);

            if (
              (score > bestScore || score === 'X' || score === 'O') &&
              score !== null
            ) {
              bestScore = score;
              move = [i, j];
            }
          }
        }
      }
      return move;
    }

    function checkBoard(botSymbol) {
      const losingPosition = checkIfLosing(botSymbol);
      const winningPosition = searchBestMove(botSymbol, checkWinner);

      if (winningPosition) return winningPosition;
      else if (losingPosition) return losingPosition;
      else return null;
    }

    function checkIfLosing(botSymbol) {
      return searchBestMove(botSymbol === 'X' ? 'O' : 'X', checkWinner);
    }

    function checkWinner() {
      let wins = [
        //rows
        [
          [0, 0],
          [0, 1],
          [0, 2],
        ],
        [
          [1, 0],
          [1, 1],
          [1, 2],
        ],
        [
          [2, 0],
          [2, 1],
          [2, 2],
        ],
        //columns
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        [
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        [
          [0, 2],
          [1, 2],
          [2, 2],
        ],
        //diagonals
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
        [
          [2, 0],
          [1, 1],
          [0, 2],
        ],
      ];
      for (let i = 0; i < wins.length; i++) {
        let [a, b, c] = wins[i];

        const x = boardCopy[a[0]][a[1]];
        const y = boardCopy[b[0]][b[1]];
        const z = boardCopy[c[0]][c[1]];

        if (x && x === y && y === z) return x;
      }

      return null;
    }

    function addSymbol(symbol, position) {
      if (boardCopy[position[0]][position[1]] != null) return false;
      else {
        boardCopy[position[0]][position[1]] = symbol;
        symbolsUsed++;
        return true;
      }
    }

    function removeSymbol(position) {
      if (boardCopy[position[0]][position[1]] != null) {
        boardCopy[position[0]][position[1]] = null;
        symbolsUsed--;
      }
    }

    function minimax(currentSymbol, botSymbol, isMaximizing, depth) {
      let winner = checkWinner();
      let playerSymbol = botSymbol === 'X' ? 'O' : 'X';

      if (winner === botSymbol) return 10 - depth;
      if (winner === playerSymbol) return -10 + depth;
      if (symbolsUsed === 9) return 0;

      if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < rows; j++) {
            if (boardCopy[i][j] === null) {
              addSymbol(botSymbol, [i, j]);

              let score = minimax(playerSymbol, botSymbol, false, depth + 1);
              removeSymbol([i, j]);
              bestScore = Math.max(score, bestScore);
            }
          }
        }

        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < rows; j++) {
            if (boardCopy[i][j] === null) {
              addSymbol(playerSymbol, [i, j]);

              let score = minimax(botSymbol, botSymbol, true, depth + 1);
              removeSymbol([i, j]);
              bestScore = Math.min(score, bestScore);
            }
          }
        }

        return bestScore;
      }
    }

    const difficultySettings = {
      easy: easyBot,
      normal: normalBot,
      hard: hardBot,
    };

    function chosenDifficulty(dif, symbol) {
      return difficultySettings[dif](symbol);
    }

    return { chosenDifficulty };
  })();

  function p2IsBot() {
    return player2.playerType === 'bot';
  }

  return {
    startGame,
    getSymbolsUsed,
    gameBoard,
    getPlayerDetails,
    botLogic,
    p2IsBot,
  };
})();
