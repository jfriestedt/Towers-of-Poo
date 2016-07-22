/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const HanoiView = __webpack_require__(1);
	const HanoiGame = __webpack_require__(2);

	$( () => {
	  const rootEl = $('.hanoi');
	  const game = new HanoiGame();
	  new HanoiView(game, rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	var HanoiView = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	  this.fromPile = null;
	  this.toPile = null;
	  this.setupTowers();
	  this.clickTower();
	};

	HanoiView.prototype.setupTowers = function () {
	  let piles = 0;
	  let discs = 0;
	  while (piles < 3) {
	    const $pile = $('<ul class="pile"></ul>');
	    $pile.data('pileNum', piles);
	    while (discs < 3) {
	      const $disc = $('<li></li>');
	      $pile.append($disc);
	      discs += 1;
	    }
	    this.$el.append($pile);
	    piles += 1;
	    discs = 0;
	  }
	  this.render();
	};

	// HanoiView.prototype.setupDiscs = function () {
	//   const $firstPile = $(this.$el.children()[0]) ;
	//   $($firstPile.children()[0]).addClass("disc sml");
	//   $($firstPile.children()[1]).addClass("disc med");
	//   $($firstPile.children()[2]).addClass("disc big");
	// };

	HanoiView.prototype.render = function () {
	  for (let tower = 0; tower < 3; tower++) {
	    for (let i = 0; i < 3; i++) {
	      let $disc = $($(this.$el.children()[tower]).children()[2 - i]);
	      // debugger
	      $disc.removeClass('disc sml med big');
	      switch (this.game.towers[tower][i]) {
	        case 1:
	          $disc.addClass('disc sml');
	          break;
	        case 2:
	          $disc.addClass('disc med');
	          break;
	        case 3:
	          $disc.addClass('disc big');
	      }
	    }
	  }
	};

	HanoiView.prototype.isWon = function () {
	  if (this.game.isWon() === true) {
	    this.$el.append('<h2>You win! Go wash your hands!!</h2>');
	    $('.pile').off('click');
	    $('.pile').addClass('over');
	  }
	};

	HanoiView.prototype.clickTower = function () {
	  $('.pile').on('click', e => {
	    const $currentTarget = $(e.currentTarget);
	    if (this.fromPile === null) {
	      this.fromPile = $currentTarget.data('pileNum');
	      $currentTarget.addClass("selected");
	    } else {
	      this.toPile =  $currentTarget.data('pileNum');

	      try {
	        this.game.move(this.fromPile, this.toPile);
	      } catch (error) {
	        alert(error.msg);
	        // return;
	      }

	      $($('.pile')[this.fromPile]).removeClass("selected");

	      this.fromPile = null;
	      this.toPile = null;
	      this.render();
	      this.isWon();
	    }
	  });
	};
	module.exports = HanoiView;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Game () {
	  this.towers = [[3,2,1], [], []];
	};

	const MoveError = function (msg) { this.msg = msg; };

	Game.prototype.isValidMove = function(startTowerIdx, endTowerIdx) {
	    const startTower = this.towers[startTowerIdx];
	    const endTower = this.towers[endTowerIdx];

	    if (startTower.length === 0) {
	      return false;
	    } else if (endTower.length == 0) {
	      return true;
	    } else {
	      const topStartDisc = startTower[startTower.length - 1];
	      const topEndDisc = endTower[endTower.length - 1];
	      return topStartDisc < topEndDisc;
	    }
	};

	Game.prototype.isWon = function(){
	    // move all the discs to the last or second tower
	    return (this.towers[2].length == 3) || (this.towers[1].length == 3);
	};


	Game.prototype.move = function(startTowerIdx, endTowerIdx) {
	    if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	      this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
	      return true;
	    } else {
	      throw new MoveError('Invalid Move!');
	    }
	};


	Game.prototype.print = function(){
	    console.log(JSON.stringify(this.towers));
	};


	Game.prototype.promptMove = function(reader, callback) {
	    this.print();
	    reader.question("Enter a starting tower: ", start => {
	      const startTowerIdx = parseInt(start);
	      reader.question("Enter an ending tower: ", end => {
	        const endTowerIdx = parseInt(end);
	        callback(startTowerIdx, endTowerIdx);
	      });
	    });
	};

	Game.prototype.run = function(reader, gameCompletionCallback) {
	    this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	      if (!this.move(startTowerIdx, endTowerIdx)) {
	        // throw function () { this.msg = 'invalid move'; }; // ????
	        console.log("Invalid move!");
	      }

	      if (!this.isWon()) {
	        // Continue to play!
	        this.run(reader, gameCompletionCallback);
	      } else {
	        this.print();
	        console.log("You win!");
	        gameCompletionCallback();
	      }
	    });
	};

	module.exports = Game;


/***/ }
/******/ ]);