(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _globals = require('./globals');

var globals = _interopRequireWildcard(_globals);

var _FillTool = require('./tools/FillTool');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

var currentTool = new _FillTool.FillTool(ctx);

$('#mainColor').spectrum({
  showPalette: true,
  clickoutFiresChange: true,
  disabled: false,
  move: function move(color) {
    globals.currentColor = color.toHexString(); // #ff0000
  }
});

setup();

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
      globals.lmdown = true;
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
      globals.mmdown = true;
      $('html').css({ cursor: '-webkit-grabbing' });
    }
  };

  container.mouseup = function (mouseData) {
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 0) {
      globals.lmdown = false;
    }
    if (downButton === 1) {
      globals.mmdown = false;
      $('html').css({ cursor: 'default' });
    }
  };

  sprite.mouseup = function (mouseData) {
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 0) {
      globals.lmdown = false;
    }
  };

  container.mousemove = function (mouseData) {
    var origEvt = mouseData.data.originalEvent;

    if (globals.mmdown) {
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

},{"./globals":2,"./tools/FillTool":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  currentColor: '#000',
  mmdown: false,
  lmdown: false
};

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseTool = exports.BaseTool = function () {
  function BaseTool(ctx) {
    _classCallCheck(this, BaseTool);

    this.ctx = ctx;
  }

  _createClass(BaseTool, [{
    key: "draw",
    value: function draw() {}
  }, {
    key: "onLeftMouseDown",
    value: function onLeftMouseDown() {}
  }, {
    key: "onRightMouseDown",
    value: function onRightMouseDown() {}
  }, {
    key: "onLeftMouseUp",
    value: function onLeftMouseUp() {}
  }, {
    key: "onRightMouseUp",
    value: function onRightMouseUp() {}
  }, {
    key: "onMouseMove",
    value: function onMouseMove() {}
  }]);

  return BaseTool;
}();

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FillTool = undefined;

var _BaseTool2 = require('./BaseTool');

var _globals = require('../globals');

var globals = _interopRequireWildcard(_globals);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FillTool = exports.FillTool = function (_BaseTool) {
  _inherits(FillTool, _BaseTool);

  function FillTool(ctx) {
    _classCallCheck(this, FillTool);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FillTool).call(this, ctx));
  }

  _createClass(FillTool, [{
    key: 'draw',
    value: function draw(pos, color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(pos.x, pos.y, 1, 1);
    }
  }, {
    key: 'onLeftMouseDown',
    value: function onLeftMouseDown(pos) {
      this.startColor = this.ctx.getImageData(pos.x, pos.y, 1, 1).data;

      var pixelStack = [pos];
      var reachLeft = false,
          reachRight = false;

      while (pixelStack.length) {
        var thisPos = pixelStack.pop();

        reachLeft = false;
        reachRight = false;
        while (thisPos.y > 0 && this.matchStartColor(thisPos)) {
          thisPos.y -= 1;
        }

        while (thisPos.y < 20 && this.matchStartColor(thisPos)) {
          this.draw(thisPos, globals.currentColor);

          if (thisPos.x > 0) {
            if (this.matchStartColor({ x: thisPos.x - 1, y: thisPos.y })) {
              if (!reachLeft) {
                pixelStack.push({ x: thisPos.x - 1, y: thisPos.y });
                reachLeft = true;
              } else if (reachLeft) {
                reachLeft = false;
              }
            }
          }

          if (thisPos.x < 20) {
            if (this.matchStartColor({ x: thisPos.x + 1, y: thisPos.y })) {

              if (!reachRight) {
                pixelStack.push({ x: thisPos.x + 1, y: thisPos.y });
                reachRight = true;
              } else if (reachRight) {
                reachRight = false;
              }
            }
          }
          thisPos.y += 1;
        }
      }
    }
  }, {
    key: 'matchStartColor',
    value: function matchStartColor(pos) {
      var newColor = this.ctx.getImageData(pos.x, pos.y, 1, 1).data;
      if (newColor.toString() === this.startColor.toString()) {
        return true;
      }
      return false;
    }
  }]);

  return FillTool;
}(_BaseTool2.BaseTool);

},{"../globals":2,"./BaseTool":3}]},{},[1])
//# sourceMappingURL=bundle.js.map
