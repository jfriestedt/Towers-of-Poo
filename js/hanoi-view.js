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

HanoiView.prototype.render = function () {
  for (let tower = 0; tower < 3; tower++) {
    for (let i = 0; i < 3; i++) {
      let $disc = $($(this.$el.children()[tower]).children()[2 - i]);
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
