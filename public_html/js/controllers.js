/* 
 * Copyright © 2014 Davorin Učakar. All rights reserved.
 */

var PlayerController = Class(null, {
  entity: null,
  isEnabled: true,
  vx: 0,
  vy: 0,
  direction: 0,
  moveStep: 2,
  animMode: 0,
  animFrame: 1,
  actionSound: null,
  pad: null,
  update: function() {
    if (this.isEnabled && !this.vx && !this.vy) {
      var inputAction = game.input.action && (!this.pad || !this.pad.isTouched());

      if (inputAction && !this.animMode && this.hasWeapon) {
        this.animMode = 2;
        this.actionSound.play();
      }
      if (game.input.left && !game.input.right) {
        this.vx = inputAction ? 0 : -this.moveStep;
        this.direction = 1;
      }
      else if (game.input.right && !game.input.left) {
        this.vx = inputAction ? 0 : +this.moveStep;
        this.direction = 2;
      }
      else if (game.input.up && !game.input.down) {
        this.vy = inputAction ? 0 : -this.moveStep;
        this.direction = 3;
      }
      else if (game.input.down && !game.input.up) {
        this.vy = inputAction ? 0 : +this.moveStep;
        this.direction = 0;
      }

      if (this.vx || this.vy) {
        var tx = this.entity.px + Math.sgn(this.vx);
        var ty = this.entity.py + Math.sgn(this.vy);

        if (0 <= tx && tx < orbis.width && 0 <= ty && ty < orbis.height && !orbis.isSolid(tx, ty)) {
          this.entity.moveTo(tx, ty);
        }
        else {
          this.vx = 0;
          this.vy = 0;
        }
      }
    }

    this.entity.frame = this.direction * 9 + this.animMode * 3 + this.animFrame;

    if (this.animMode) {
      if (game.frame % 4 === 0) {
        this.animFrame = (this.animFrame + 1) % 3;
        this.animMode = this.animFrame === 1 ? 0 : this.animMode;
      }
    }
    else if (this.vx || this.vy) {
      this.entity.moveBy(this.vx, this.vy);

      if (game.frame % 4 === 0) {
        this.animFrame = (this.animFrame + 1) % 3;
      }

      if ((this.vx && (this.entity.x - this.entity.OFFSET_X) % 16 === 0) ||
          (this.vy && (this.entity.y - this.entity.OFFSET_Y) % 16 === 0))
      {
        this.animFrame = 1;
        this.vx = 0;
        this.vy = 0;
      }
    }
  },
  enable: function(value) {
    if (!this.isEnabled && value) {
      this.pad.visible = true;
    }
    else if (this.isEnabled && !value) {
      this.pad.visible = false;
    }
    this.isEnabled = value;
  },
  init: function(entity) {
    this.entity = entity;
    this.actionSound = game.assets["data/jump.wav"];
    this.pad = enchant.ui.Pad();
    this.pad.x = 0;
    this.pad.y = game.height - 100;
    this.pad.isTouched = function() {
      for (var dir in this.input) {
        if (this.input[dir]) {
          return true;
        }
      }
      return false;
    };
    this.hasWeapon = true;

    var controller = this;

    entity.frame = this.direction * 9 + this.animFrame;
    entity.addEventListener(enchant.Event.ENTER_FRAME, function() {
      controller.update();
    });

    game.rootScene.addChild(this.pad);
  },
  destroy: function() {
    game.rootScene.removeChild(this.pad);

    this.entity.removeEventListener(enchant.Event.ENTER_FRAME, this.update);
    this.entity.frame = this.direction * 9 + this.animFrame;
    this.entity.realign();
  }
});
