/* 
 * Copyright © 2014 Davorin Učakar. All rights reserved.
 */

enchant();

var game = null;

window.onload = function () {
  game = new enchant.Core(480, 320);
  game.preload("data/map1.png", "data/chara0.png", "data/chara5.png", "data/jump.wav");
  game.keybind(87, "up");
  game.keybind(83, "down");
  game.keybind(65, "left");
  game.keybind(68, "right");
  game.keybind(32, "action");
  game.rootScene.addEventListener(enchant.Event.TOUCH_START, function () {
    game.changeButtonState("action", true);
  });
  game.rootScene.addEventListener(enchant.Event.TOUCH_END, function () {
    game.changeButtonState("action", false);
  });

  game.onload = function () {
    orbis = new Orbis(game.assets["data/map1.png"], LAYERS);

    var stage = new enchant.Group();
    stage.addChild(orbis.layer.background);
    stage.addChild(orbis.layer.devices);
    stage.addChild(orbis.layer.items);
    stage.addChild(orbis.layer.chars);
    stage.addChild(orbis.layer.foreground);

    var lifeLabel = new window.enchant.ui.LifeLabel(4, 4, 10);
    lifeLabel.label.text = "";
    for (var i = 0; i < lifeLabel.heart.length; ++i) {
      lifeLabel.heart[i].x = i * 18;
    }
    lifeLabel.life = 1 + 1.0 * 9;

    game.rootScene.addChild(stage);
    game.rootScene.addChild(lifeLabel);
    game.onexitframe = function () {
      var x = Math.min((game.width - 16) / 2 - player.x, 0);
      var y = Math.min((game.height - 16) / 2 - player.y, 0);
      x = Math.max(game.width, x + orbis.pixelWidth) - orbis.pixelWidth;
      y = Math.max(game.height, y + orbis.pixelHeight) - orbis.pixelHeight;
      stage.x = x;
      stage.y = y;
    };

    var player = new Char(game.assets["data/chara5.png"]);
    player.position(7, 7);
    player.controller = new PlayerController(player);
    player.controller.enable(true);

    for (var i = 0; i < 5; ++i) {
      var box = new Device(game.assets["data/map1.png"], 521);
      box.index = i;
      box.position(4 + i, 6);
    }
  };
  game.start();
};
