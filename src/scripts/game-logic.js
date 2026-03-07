import { Player } from './player.js';

export const game = (function () {
  const rows = 3;

  let symbolsUsed;
  let player1;
  let player2;

  let gameBoard = (function () {
    let board;

    function resetBoard() {
      symbolsUsed = 0;
      board = null;

      board = Array.from({ length: 3 }, () => new Array(3).fill(null));
      return board;
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
      if (
        position[0] < 0 ||
        position[1] < 0 ||
        position[0] > rows ||
        position[1] > rows ||
        board[position[0]][position[1]] != null
      )
        return false;
      else {
        board[position[0]][[position[1]]] = symbol;
        symbolsUsed++;
        return true;
      }
    }

    return { checkWinner, addSymbol, resetBoard };
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

  return { startGame, getSymbolsUsed, gameBoard, getPlayerDetails };
})();
