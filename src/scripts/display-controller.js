import { imageController } from './image-controller.js';
import { game } from './game-logic.js';

export const displayController = (function () {
  const rows = 3;

  let symbolSelectorP1,
    symbolSelectorP2,
    startBtn,
    p1Score,
    p2Score,
    board,
    selectMenu;

  let player1Symbol = 'X';
  let player2Symbol = 'O';

  function initDOMVariables() {
    symbolSelectorP1 = document.querySelectorAll('#first-player .choice-btn');
    symbolSelectorP2 = document.querySelectorAll('#second-player .choice-btn');

    symbolSelectorP1.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        setSymbol(val);
      });
    });

    symbolSelectorP2.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value === 'X' ? 'O' : 'X';
        setSymbol(val);
      });
    });

    startBtn = document.querySelector('#start button');
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const textInputs = document.querySelectorAll('input[type="text"]');
      const p1NameValid = textInputs[0].checkValidity();
      const p2NameValid = textInputs[1].checkValidity();

      if (!p1NameValid) {
        textInputs[0].reportValidity();
        return;
      }

      if (!p2NameValid) {
        textInputs[1].reportValidity();
        return;
      }

      const homeScreen = document.getElementById('home-screen');
      homeScreen.classList.add('hidden');

      displayBoard(textInputs[0].value, textInputs[1].value);

      game.startGame();
    });

    p1Score = document.getElementById('player1-score');
    p2Score = document.getElementById('player2-score');
    board = document.getElementById('board');

    selectMenu = document.querySelector('.difficulties');
    selectMenu.addEventListener('click', (e) =>
      selectMenuToggle(e, selectMenu),
    );

    function selectMenuToggle(e, selectMenu) {
      const target = e.target;
      if (
        target.classList.contains('select-trigger') ||
        target.parentNode.classList.contains('select-trigger')
      ) {
        e.preventDefault();
        selectMenu.classList.toggle('open');
      }
      if (target.classList.contains('difficulty')) {
        const menuChildNodes = selectMenu.children;
        menuChildNodes[0].children[0].textContent = target.textContent;
        for (const item of menuChildNodes[1].children) {
          if (item.classList.contains('selected'))
            item.classList.remove('selected');
        }
        target.classList.add('selected');
        selectMenu.classList.remove('open');
      }
    }

    const selectPlayerLabels = document.querySelectorAll(
      '.type-of-player label',
    );
    const selectPlayerLabelsArr = Array.from(selectPlayerLabels);
    selectPlayerLabelsArr.forEach((label) => {
      label.addEventListener('click', () => {
        for (const it of selectPlayerLabelsArr)
          if (it.classList.contains('selected'))
            it.classList.remove('selected');
        label.classList.add('selected');
      });
    });
  }

  function setSymbol(p1Choice) {
    player1Symbol = p1Choice;
    player2Symbol = p1Choice === 'X' ? 'O' : 'X';

    function addActiveSymbol(btn, playerSymbol) {
      if (btn.dataset.value === playerSymbol)
        btn.classList.add(`active${playerSymbol === 'X' ? 'X' : 'O'}`);
      else btn.classList.remove(`active${playerSymbol !== 'X' ? 'X' : 'O'}`);
    }

    symbolSelectorP1.forEach((btn) => {
      addActiveSymbol(btn, player1Symbol);
    });

    symbolSelectorP2.forEach((btn) => {
      addActiveSymbol(btn, player2Symbol);
    });
  }

  function displayBoard(p1Name, p2Name) {
    const gameUI = document.getElementById('game-ui');
    resetBoard();
    createBoard();

    gameUI.classList.remove('hidden');

    const playersNamesH4 = document.querySelectorAll('.name');
    playersNamesH4[0].textContent = p1Name;
    playersNamesH4[1].textContent = p2Name;

    imageController.setPlayersAvatar(0);
    imageController.setPlayersAvatar(1);

    const ingameSymbol = document.querySelectorAll('.score-container h3');
    const playersSymbol = [player1Symbol, player2Symbol];

    ingameSymbol.forEach((symbol, index) => {
      symbol.removeAttribute('class');
      symbol.textContent = playersSymbol[index];
      symbol.classList.add(`${playersSymbol[index] === 'X' ? 'X' : 'O'}`);
    });

    p1Score.textContent = '0';
    p2Score.textContent = '0';

    board.addEventListener('click', playOnBoard);
  }

  function resetBoard() {
    if (!board.children.length) return;

    Array.from(board.children).forEach((div) => {
      div.remove();
    });
  }

  function createBoard() {
    board.removeAttribute('class');
    board.classList.add(player1Symbol);
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= rows; j++) {
        const div = document.createElement('div');
        div.dataset.row = i;
        div.dataset.col = j;
        board.appendChild(div);
      }
    }
  }

  function incrementScore(player) {
    switch (player) {
      case 1:
        p1Score.textContent = +p1Score.textContent + 1;
        break;
      case 2:
        p2Score.textContent = +p2Score.textContent + 1;
        break;
    }
  }

  function printRoundResult(winnerSymbol) {
    const winnerPara = document.querySelector('#winner p');
    if (winnerSymbol === 'X' || winnerSymbol === 'O') {
      const [winnerPlayer, winnerPlayerNumber] =
        game.getPlayerDetails(winnerSymbol);
      winnerPara.innerHTML = `The winner of the round is <strong>${winnerPlayer.name}</strong> (<strong>${winnerPlayer.symbol}</strong>)!`;
      incrementScore(winnerPlayerNumber);
    } else if (winnerSymbol === undefined)
      winnerPara.innerHTML = 'This round ends with a <strong>DRAW</strong>!';
  }

  const goToMenuBtn = document.getElementById('go-to-menu');
  goToMenuBtn.addEventListener('click', () => {
    const gameUi = document.getElementById('game-ui');
    gameUi.classList.add('hidden');

    const homeScreen = document.getElementById('home-screen');
    homeScreen.classList.remove('hidden');

    const winnerPara = document.querySelector('#winner p');
    winnerPara.textContent = '';
  });

  const anotherRound = document.getElementById('another-round');
  anotherRound.addEventListener('click', () => {
    resetBoard();
    createBoard();

    const winnerPara = document.querySelector('#winner p');
    winnerPara.textContent = '';

    game.gameBoard.resetBoard();

    board.addEventListener('click', playOnBoard);
  });

  function playOnBoard(e) {
    if (!e.target.dataset.row) return;

    const square = e.target;
    const symbol =
      game.getSymbolsUsed() % 2 === 0 ? player1Symbol : player2Symbol;

    if (
      addSymbolAndCheckWinner(symbol, [
        square.dataset.row - 1,
        square.dataset.col - 1,
      ])
    )
      if (game.p2IsBot() && game.getSymbolsUsed() < 9) {
        const selectedDifficulty = document.querySelector(
          '.difficulty.selected',
        );
        addSymbolAndCheckWinner(
          player2Symbol,
          game.botLogic.chosenDifficulty(
            selectedDifficulty.textContent.toLowerCase(),
            player2Symbol,
          ),
        );
      }
  }

  function addSymbolAndCheckWinner(symbol, position) {
    if (game.gameBoard.addSymbol(symbol, [position[0], position[1]])) {
      let square;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
          square = board.children[rows * i + j];
          if (
            +square.dataset.row === position[0] + 1 &&
            +square.dataset.col === position[1] + 1
          )
            break;
        }
        if (
          +square.dataset.row === position[0] + 1 &&
          +square.dataset.col === position[1] + 1
        )
          break;
      }

      square.textContent = symbol;
      square.classList.add(symbol);

      board.removeAttribute('class');
      board.classList.add(symbol === 'X' ? 'O' : 'X');

      const winner = game.gameBoard.checkWinner();
      if (winner) {
        printRoundResult(winner[2]);
        board.removeAttribute('class');
        board.removeEventListener('click', playOnBoard);
        const [type, diagType] = [winner[0], winner[1]];
        drawLineOverWInningPositions([type, diagType], winner[2]);

        return false;
      }

      return true;
    } else return false;
  }

  function drawLineOverWInningPositions(positions, winningSymbol) {
    function addHLine(i, type) {
      const hLine = document.createElement('hr');
      board.children[i].appendChild(hLine);
      hLine.classList.add(`line${j}`);
      hLine.classList.add(type);
      hLine.classList.add(winningSymbol);
    }

    let j = 0;
    switch (positions[0]) {
      case 'diag':
        switch (positions[1]) {
          case 2:
            for (let i = 0; i <= 8; i += 4) {
              addHLine(i, `${positions[0]}1`);
              j++;
            }
            break;
          case 1:
            for (let i = 6; i >= 2; i -= 2) {
              addHLine(i, `${positions[0]}2`);
              j++;
            }
            break;
        }
        break;
      case 'row':
        for (let i = 0; i < 3; i++) {
          addHLine(i + positions[1] * 3, positions[0]);
          j++;
        }
        break;
      case 'col':
        for (let i = 0; i < 3; i++) {
          addHLine(i * 3 + positions[1], positions[0]);
          j++;
        }
        break;
    }
  }

  return { resetBoard, incrementScore, initDOMVariables };
})();
