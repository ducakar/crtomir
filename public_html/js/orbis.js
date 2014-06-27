/* 
 * Copyright © 2014 Davorin Učakar. All rights reserved.
 */

var orbis = null;

var Field = {
  NONE: 0,
  CHAR: 1,
  ITEM: 2,
  DEVICE: 4,
  SOLID: 8,
  SIZE: 16
};

var Entity = {
  moveTo: function(px, py) {
    var fieldFlags = orbis.fieldFlags;
    var fieldEnts = orbis[this.FIELD];

    assert(fieldFlags[this.px][this.py] & Field.SOLID, "Moving to occupied field");

    fieldFlags[this.px][this.py] &= ~this.FLAGS;
    fieldFlags[px][py] |= this.FLAGS;
    fieldEnts[this.px][this.py] = null;
    fieldEnts[px][py] = this;

    this.px = px;
    this.py = py;
  },
  position: function(px, py) {
    var fieldFlags = orbis.fieldFlags;
    var fieldEnts = orbis[this.FIELD];

    assert(!(fieldFlags[px][py] & Field.SOLID), "Positioning on occupied field");

    fieldFlags[px][py] |= this.FLAGS;
    fieldEnts[px][py] = this;

    this.px = px;
    this.py = py;
    this.x = px * Field.SIZE + (this.OFFSET_X || 0);
    this.y = py * Field.SIZE + (this.OFFSET_Y || 0);
    this.visible = true;
  },
  unposition: function() {
    var fieldFlags = orbis.fieldFlags;
    var fieldEnts = orbis[this.FIELD];

    assert(fieldFlags[this.px][this.py] === this, "Unpositioning non-positioned entity");

    fieldFlags[this.px][this.py] &= ~this.FLAGS;
    fieldEnts[this.px][this.py] = null;

    this.px = -1;
    this.py = -1;
    this.x = 0;
    this.y = 0;
    this.visible = false;
  },
  init: function(image) {
    this.visible = false;
    this.image = image;
    this.array = orbis[this.ARRAY];
    this.array.push(this);
  },
  destroy: function() {
    assert(this.px === -1 && this.py === -1, "Destroying positioned entity");

    this.visible = false;
    this.image = null;
    this.array.splice(this.array.indexOf(this), 1);
  }
};

var Char = Class(new enchant.Sprite(Field.SIZE * 2, Field.SIZE * 2), {
  FLAGS: Field.CHAR | Field.SOLID,
  FIELD: "fieldChars",
  ARRAY: "chars",
  OFFSET_X: -8,
  OFFSET_Y: -12,
  px: -1,
  py: -1,
  array: null,
  moveTo: Entity.moveTo,
  position: Entity.position,
  unposition: Entity.unposition,
  init: Entity.init
});

var Item = Class(new enchant.Sprite(Field.SIZE, Field.SIZE), {
  FLAGS: Field.ITEM | Field.SOLID,
  FIELD: "fieldItems",
  ARRAY: "items",
  px: -1,
  py: -1,
  array: null,
  position: Entity.position,
  unposition: Entity.unposition,
  init: Entity.init
});

var Orbis = Class(null, {
  width: 0,
  height: 0,
  chars: [],
  items: [],
  devices: [],
  fieldFlags: null,
  fieldChars: null,
  fieldItems: null,
  fieldDevices: null,
  backgroundMap: null,
  foregroundMap: null,
  isSolid: function(px, py) {
    return this.fieldFlags[px][py] & Field.SOLID;
  },
  charAt: function(px, py) {
    return this.fieldChars[px][py];
  },
  itemAt: function(px, py) {
    return this.fieldItems[px][py];
  },
  deviceAt: function(px, py) {
    return this.fieldDevices[px][py];
  },
  init: function(tilesImage, layers) {
    this.width = layers.collision[0].length;
    this.height = layers.collision.length;
    this.pixelWidth = this.width * Field.SIZE;
    this.pixelHeight = this.height * Field.SIZE;

    this.fieldFlags = new Array(this.width);
    this.fieldChars = new Array(this.width);
    this.fieldItems = new Array(this.width);
    this.fieldDevices = new Array(this.width);

    for (var i = 0; i < this.width; ++i) {
      this.fieldFlags[i] = new Array(this.height);
      this.fieldChars[i] = new Array(this.height);
      this.fieldItems[i] = new Array(this.height);
      this.fieldDevices[i] = new Array(this.height);

      for (var j = 0; j < this.height; ++j) {
        this.fieldFlags[i][j] = layers.collision[j][i] ? Field.SOLID : Field.NONE;
        this.fieldChars[i][j] = null;
        this.fieldItems[i][j] = null;
        this.fieldDevices[i][j] = null;
      }
    }

    this.backgroundMap = new Map(Field.SIZE, Field.SIZE);
    this.backgroundMap.image = tilesImage;
    this.backgroundMap.loadData.apply(this.backgroundMap, layers.background);
    this.foregroundMap = new Map(Field.SIZE, Field.SIZE);
    this.foregroundMap.image = tilesImage;
    this.foregroundMap.loadData.apply(this.foregroundMap, layers.foreground);
  }
});
