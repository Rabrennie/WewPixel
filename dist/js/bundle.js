(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Code goes here
PIXI.loader.add('transparent', 'assets/transparent.png').load(setup);

var currentColor = '#000000';
var mmdown = false;
var lmdown = false;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
var container = new PIXI.Container();
var docRenderer = document.body.appendChild(renderer.view);
var docCanvas = document.body.appendChild(canvas);
var sprite;

var c2 = document.createElement('canvas');
var ctx2 = c2.getContext('2d');

document.body.appendChild(c2);

var pencilTool = function () {
  function pencilTool() {
    _classCallCheck(this, pencilTool);
  }

  _createClass(pencilTool, [{
    key: 'draw',
    value: function draw(pos, color) {
      ctx.fillStyle = color;
      ctx.fillRect(pos.x, pos.y, 1, 1);
    }
  }, {
    key: 'onLeftMouseDown',
    value: function onLeftMouseDown(pos) {
      this.draw(pos, currentColor);
    }
  }, {
    key: 'onRightMouseDown',
    value: function onRightMouseDown(pos) {
      this.draw(pos, currentColor);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(pos) {
      if (lmdown) {
        this.draw(pos, currentColor);
      }
    }
  }]);

  return pencilTool;
}();

var currentTool = new pencilTool();

$('#mainColor').spectrum({
  showPalette: true,
  clickoutFiresChange: true,
  disabled: false,
  move: function move(color) {
    currentColor = color.toHexString(); // #ff0000
  }
});

function setup() {
  canvas.width = c2.width = 20;
  canvas.height = c2.height = 20;

  console.log(PIXI.loader);
  ctx2.fillStyle = 'white';
  ctx2.fillRect(0, 0, 20, 20);
  for (var i = 0; i <= canvas.height; i++) {
    for (var x = 0; x <= canvas.width; x++) {
      if ((x + i) % 2 === 0) {
        ctx2.fillStyle = 'white';
      } else {
        ctx2.fillStyle = '#E0E0E0';
      }

      ctx2.fillRect(x, i, 1, 1);
    }
  }
  // ctx.fillStyle = 'white'
  // ctx.fillRect(0,0,canvas.width,canvas.height);

  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  var canvasTexture = PIXI.Texture.fromCanvas(canvas);
  var c2text = PIXI.Texture.fromCanvas(c2);
  renderer.backgroundColor = 0xBABABA;

  console.log(container);
  sprite = new PIXI.Sprite(canvasTexture);
  sprite.interactive = true;

  var tilingSprite = new PIXI.Sprite(c2text);
  console.log(tilingSprite);
  container.addChild(tilingSprite);
  container.addChild(sprite);
  container.scale.x = 10;
  container.scale.y = 10;
  container.x = renderer.width / 2 - canvas.width * 10 / 2;
  container.y = renderer.height / 2 - canvas.height * 10;
  // add the renderer view element to the DOM

  $(docRenderer).attr('class', 'renderer');
  $(docCanvas).css({ width: '80px' });
  $(docCanvas).attr('class', 'imgPreview');

  requestAnimationFrame(animate);

  container.interactive = true;
  container.hitArea = new PIXI.Rectangle(-1000, -1000, 2000, 2000);

  function floorPos(pos) {
    return { x: Math.floor(pos.x), y: Math.floor(pos.y) };
  }

  sprite.mousedown = function (mouseData) {
    var pos = floorPos(mouseData.data.getLocalPosition(sprite));
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 0) {
      lmdown = true;
      currentTool.onLeftMouseDown(pos);
    }
  };

  sprite.mousemove = function (mouseData) {
    var pos = floorPos(mouseData.data.getLocalPosition(sprite));
    currentTool.onMouseMove(pos);
  };

  container.mousedown = function (mouseData) {
    console.log(mouseData);
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 1) {
      mmdown = true;
      $('html').css({ cursor: '-webkit-grabbing' });
    }
  };

  container.mouseup = function (mouseData) {
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 0) {
      lmdown = false;
    }
    if (downButton === 1) {
      mmdown = false;
      $('html').css({ cursor: 'default' });
    }
  };

  sprite.mouseup = function (mouseData) {
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 0) {
      lmdown = false;
    }
  };

  container.mousemove = function (mouseData) {
    var origEvt = mouseData.data.originalEvent;

    if (mmdown) {
      container.x += origEvt.movementX;
      container.y += origEvt.movementY;
    }
  };
}

function animate() {
  requestAnimationFrame(animate);
  // render the stage
  sprite.texture.update();
  renderer.render(container);
}

},{}]},{},[1])
//# sourceMappingURL=bundle.js.map
