const HanoiView = require("./hanoi-view.js");
const HanoiGame = require("../../hanoi_solution/solution/game.js");

$( () => {
  const rootEl = $('.hanoi');
  const game = new HanoiGame();
  new HanoiView(game, rootEl);
});
