export function Player(playerNumber) {
  const name = document.getElementById(`player${playerNumber}-name`).value;
  let symbol = Array.from(
    document.querySelectorAll(`#player${playerNumber}-symbol .choice-btn`),
  ).filter(
    (btn) =>
      btn.classList.contains('activeX') || btn.classList.contains('activeO'),
  );
  symbol = symbol[0].dataset.value;
  let score = 0;
  let playerType = 'player';

  if (playerNumber === 2) {
    const typeOfPlayer = document.querySelector(
      '.type-of-player label.selected',
    );

    playerType = typeOfPlayer.dataset.player;
  }

  return { name, symbol, score, playerType };
}
