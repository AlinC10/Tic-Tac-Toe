function Player(playerNumber) {
    const name = document.getElementById(`player${playerNumber}-name`).value;
    let symbol = Array.from(
        document.querySelectorAll(`#player${playerNumber}-symbol .choice-btn`),
    ).filter(
        (btn) =>
            btn.classList.contains("activeX") ||
            btn.classList.contains("activeO"),
    );
    symbol = symbol[0].dataset.value;
    let score = 0;

    return { name, symbol, score };
}

const rows = 3;

const game = (function () {
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
            for (let combo of wins) {
                let [a, b, c] = combo;

                const x = board[a[0]][a[1]];
                const y = board[b[0]][b[1]];
                const z = board[c[0]][c[1]];

                if (x && x === y && y === z) return x;
            }

            if (symbolsUsed === 9) {
                console.log("Draw");
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

let displayController;

window.addEventListener("DOMContentLoaded", () => {
    displayController = (function () {
        const symbolSelectorP1 = document.querySelectorAll(
            "#first-player .choice-btn",
        );
        const symbolSelectorP2 = document.querySelectorAll(
            "#second-player .choice-btn",
        );
        const startBtn = document.querySelector("#start button");
        const p1Score = document.getElementById("player1-score");
        const p2Score = document.getElementById("player2-score");
        const board = document.getElementById("board");

        let player1Symbol = "X";
        let player2Symbol = "O";

        function setSymbol(p1Choice) {
            player1Symbol = p1Choice;
            player2Symbol = p1Choice === "X" ? "O" : "X";

            function addActiveSymbol(btn, playerSymbol) {
                if (btn.dataset.value === playerSymbol)
                    btn.classList.add(
                        `active${playerSymbol === "X" ? "X" : "O"}`,
                    );
                else
                    btn.classList.remove(
                        `active${playerSymbol !== "X" ? "X" : "O"}`,
                    );
            }

            symbolSelectorP1.forEach((btn) => {
                addActiveSymbol(btn, player1Symbol);
            });

            symbolSelectorP2.forEach((btn) => {
                addActiveSymbol(btn, player2Symbol);
            });
        }

        symbolSelectorP1.forEach((btn) => {
            btn.addEventListener("click", () => {
                const val = btn.dataset.value;
                setSymbol(val);
            });
        });

        symbolSelectorP2.forEach((btn) => {
            btn.addEventListener("click", () => {
                const val = btn.dataset.value === "X" ? "O" : "X";
                setSymbol(val);
            });
        });

        function displayBoard(p1Name, p2Name) {
            const gameUI = document.getElementById("game-ui");
            resetBoard();
            createBoard();

            gameUI.classList.remove("hidden");

            const playersNamesH4 = document.querySelectorAll(".name");
            playersNamesH4[0].textContent = p1Name;
            playersNamesH4[1].textContent = p2Name;

            const playersImg = document.querySelectorAll(".players.cards img");
            const playersAvatar = document.querySelectorAll(".ingame-avatar");
            playersAvatar[0].src = playersImg[0].src;
            playersAvatar[1].src = playersImg[1].src;

            const ingameSymbol = document.querySelectorAll(
                ".score-container h3",
            );
            const playersSymbol = [player1Symbol, player2Symbol];

            ingameSymbol.forEach((symbol, index) => {
                symbol.removeAttribute("class");
                symbol.textContent = playersSymbol[index];
                symbol.classList.add(
                    `${playersSymbol[index] === "X" ? "X" : "O"}`,
                );
            });

            p1Score.textContent = "0";
            p2Score.textContent = "0";

            board.addEventListener("click", playOnBoard);
        }

        startBtn.addEventListener("click", (e) => {
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

            const homeScreen = document.getElementById("home-screen");
            homeScreen.classList.add("hidden");

            displayBoard(textInputs[0].value, textInputs[1].value);

            game.startGame();
        });

        function resetBoard() {
            if (!board.children.length) return;

            Array.from(board.children).forEach((div) => {
                div.remove();
            });
        }

        function createBoard() {
            board.removeAttribute("class");
            board.classList.add(player1Symbol);
            for (let i = 1; i <= rows; i++) {
                for (let j = 1; j <= rows; j++) {
                    const div = document.createElement("div");
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
            const winnerPara = document.querySelector("#winner p");
            if (winnerSymbol === "X" || winnerSymbol === "O") {
                const [winnerPlayer, winnerPlayerNumber] =
                    game.getPlayerDetails(winnerSymbol);
                winnerPara.innerHTML = `The winner of the round is <strong>${winnerPlayer.name}</strong> (<strong>${winnerPlayer.symbol}</strong>)!`;
                incrementScore(winnerPlayerNumber);
            } else if (winnerSymbol === 1)
                winnerPara.innerHTML =
                    "This round ends with a <strong>DRAW</strong>!";
        }

        const goToMenuBtn = document.getElementById("go-to-menu");
        goToMenuBtn.addEventListener("click", () => {
            const gameUi = document.getElementById("game-ui");
            gameUi.classList.add("hidden");

            const homeScreen = document.getElementById("home-screen");
            homeScreen.classList.remove("hidden");

            const winnerPara = document.querySelector("#winner p");
            winnerPara.textContent = "";
        });

        const anotherRound = document.getElementById("another-round");
        anotherRound.addEventListener("click", () => {
            resetBoard();
            createBoard();

            const winnerPara = document.querySelector("#winner p");
            winnerPara.textContent = "";

            game.gameBoard.resetBoard();

            board.addEventListener("click", playOnBoard);
        });

        function playOnBoard(e) {
            if (!e.target.dataset.row) return;

            const square = e.target;
            const symbol =
                game.getSymbolsUsed() % 2 === 0 ? player1Symbol : player2Symbol;
            if (
                game.gameBoard.addSymbol(symbol, [
                    +square.dataset.row - 1,
                    +square.dataset.col - 1,
                ])
            ) {
                board.removeAttribute("class");
                board.classList.add(symbol === "X" ? "O" : "X");
                square.textContent = symbol;
                square.classList.add(symbol);

                const winner = game.gameBoard.checkWinner();
                if (winner) {
                    printRoundResult(winner);
                    board.removeAttribute("class");
                    board.removeEventListener("click", playOnBoard);
                }
            }
        }

        return { resetBoard, incrementScore };
    })();
});

window.addEventListener("DOMContentLoaded", pageTheme)

function pageTheme() {
    const toggleBtn = document.getElementById("theme-modes");
    const html = document.querySelector("html");

    if(!toggleBtn) return;

    const iconLightMode = "./images/light-svgrepo-com.svg";
    const iconDarkMode = "./images/night-svgrepo-com.svg";

    function updateIcon(isDark) {
        toggleBtn.src = (isDark) ? iconLightMode : iconDarkMode;
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }

    const currentTheme = localStorage.getItem("theme");
    if(currentTheme === "dark")
    {
        html.classList.add("dark-mode");
        updateIcon(true);
    }
    else
        updateIcon(false);

    toggleBtn.addEventListener("click", () => {
        html.classList.toggle("dark-mode");

        const isDark = html.classList.contains("dark-mode");
        updateIcon(isDark);
    })
}