/*
 * Copyright © 2014 Davorin Učakar. All rights reserved.
 */

var assert = function (condition, message) {
  if (!condition) {
    throw Error("Assertion failed: " + message);
  }
};

var Class = function (superclass, definition) {
  var properties = {};
  for (var p in definition) {
    properties[p] = {value: definition[p], writable: true, enumerable: true};
  }
  var prototype = Object.create(superclass, properties);

  return function () {
    this.__proto__ = prototype;

    if (this.init) {
      this.init.apply(this, arguments);
    }
  };
};

Math.sgn = function (x) {
  return x === 0 ? 0 : x < 0 ? -1 : 1;
};
