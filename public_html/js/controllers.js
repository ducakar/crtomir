/* 
 * Copyright © 2014 Davorin Učakar. All rights reserved.
 */

var PlayerController = Class(null, {
  update: function() {
    if (!this.vx && !this.vy) {
      var inputAction = game.input.action && (!this.pad || !this.pad.isTouched());

      if (inputAction && !this.animMode && this.hasWeapon) {
        this.animMode = 2;
        this.actionSound.play();
      }
      if (game.input.left && !game.input.right) {
        this.direction = 1;
        this.vx = inputAction ? 0 : -this.moveStep;
      }
      else if (game.input.right && !game.input.left) {
        this.direction = 2;
        this.vx = inputAction ? 0 : +this.moveStep;
      }
      else if (game.input.up && !game.input.down) {
        this.direction = 3;
        this.vy = inputAction ? 0 : -this.moveStep;
      }
      else if (game.input.down && !game.input.up) {
        this.direction = 0;
        this.vy = inputAction ? 0 : +this.moveStep;
      }

      if (this.vx || this.vy) {
        var tx = this.px + Math.sgn(this.vx);
        var ty = this.py + Math.sgn(this.vy);

        if (0 <= tx && tx < orbis.width && 0 <= ty && ty < orbis.height && !orbis.isSolid(tx, ty)) {
          this.moveTo(tx, ty);
        }
        else {
          this.vx = 0;
          this.vy = 0;
        }
      }
    }

    if (this.animMode) {
      if (game.frame % 4 === 0) {
        this.animFrame = (this.animFrame + 1) % 3;
        this.animMode = this.animFrame === 1 ? 0 : this.animMode;
      }
    }
    else if (this.vx || this.vy) {
      this.moveBy(this.vx, this.vy);

      if (game.frame % 4 === 0) {
        this.animFrame = (this.animFrame + 1) % 3;
      }
      if ((this.vx && (this.x - this.OFFSET_X) % 16 === 0) ||
          (this.vy && (this.y - this.OFFSET_Y) % 16 === 0))
      {
        this.animFrame = 1;
        this.vx = 0;
        this.vy = 0;
      }
    }

    this.frame = this.direction * 9 + this.animMode * 3 + this.animFrame;
  },
  init: function(entity) {
    this.entity = entity;

    entity.vx = 0;
    entity.vy = 0;
    entity.direction = 0;
    entity.moveStep = 2;
    entity.animFrame = 1;
    entity.animMode = 0;
    entity.actionSound = game.assets["data/jump.wav"];
    entity.hasWeapon = true;

    if (enableTouchInterface) {
      entity.pad = enchant.ui.Pad();
      entity.pad.x = 0;
      entity.pad.y = game.height - 100;
      entity.pad.isTouched = function() {
        for (var dir in this.input) {
          if (this.input[dir]) {
            return true;
          }
        }
        return false;
      };
      game.rootScene.addChild(entity.pad);
    }

    entity.frame = this.direction * 9 + this.animFrame;
    entity.addEventListener(enchant.Event.ENTER_FRAME, this.update);
  },
  destroy: function() {
    var entity = this.entity;

    entity.removeEventListener(enchant.Event.ENTER_FRAME, this.update);
    entity.frame = this.direction * 9 + this.animFrame;

    if (enableTouchInterface) {
      game.rootScene.removeChild(entity.pad);
      delete entity.pad;
    }

    delete entity.vx;
    delete entity.vy;
    delete entity.direction;
    delete entity.moveStep;
    delete entity.animFrame;
    delete entity.animMode;
    delete entity.actionSound;
    delete entity.hasWeapon;
  }
});
