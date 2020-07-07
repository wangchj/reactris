import AppState from './models/app_state.js';
// import DualGameController from './controllers/two-player/dual_game_controller.js';
import GameSelectionController from './controllers/game_selection_controller.js';
import SinglePlayerGameController from './controllers/single_player_game_controller.js';

document.addEventListener('GameTypePicked', function(event) {
  var gameInfo = event.detail;
  doRoute(gameInfo.gameType, gameInfo);
});

doRoute('GameSelection');

function doRoute(route, params) {
  console.log('app.js doRoute()', route, params);
  var controller;
  switch (route) {
    case 'GameSelection':
      controller = new GameSelectionController();
      break;
    case '1P':
      controller = new SinglePlayerGameController();
      break;
    case '2P':
      controller = new DualGameController();
  }
  controller.start();
}