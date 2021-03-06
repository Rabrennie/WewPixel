(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _FillTool = require('./tools/FillTool');

var _PencilTool = require('./tools/PencilTool');

var _EraserTool = require('./tools/EraserTool');

var _LineTool = require('./tools/LineTool');

var _MoveTool = require('./tools/MoveTool');

var _redo = require('./helpers/redo');

var _redo2 = _interopRequireDefault(_redo);

var _undo = require('./helpers/undo');

var _undo2 = _interopRequireDefault(_undo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = _globals2.default.canvas,
    ctx = _globals2.default.ctx,
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight),
    container = _globals2.default.container,
    docRenderer = document.body.appendChild(renderer.view),
    docCanvas = document.body.appendChild(canvas),
    c2 = document.createElement('canvas'),
    ctx2 = c2.getContext('2d'),
    canvasHistory = _globals2.default.canvasHistory,

// WHERE WE'RE GOING WE DON'T NEED ROADS
canvasFuture = _globals2.default.canvasFuture;

var sprite = undefined,
    currentTool = new _MoveTool.MoveTool(ctx);

document.body.appendChild(c2);

$('#mainColor').spectrum({
  color: _globals2.default.currentColor,
  showPalette: true,
  clickoutFiresChange: true,
  disabled: false,
  move: function move(color) {
    _globals2.default.currentColor = color.toHexString(); // #ff0000
  }
});

$('#pencilBtn').click(function () {
  currentTool = new _PencilTool.PencilTool(ctx);
});

$('#fillBtn').click(function () {
  currentTool = new _FillTool.FillTool(ctx);
});

$('#eraserBtn').click(function () {
  currentTool = new _EraserTool.EraserTool(ctx);
});

$('#lineBtn').click(function () {
  currentTool = new _LineTool.LineTool(ctx);
});

$('#moveBtn').click(function () {
  currentTool = new _MoveTool.MoveTool(ctx);
});

var keyBindings = {
  66: function _() {
    if (!_globals2.default.lmdown) currentTool = new _PencilTool.PencilTool(ctx);
  },
  69: function _() {
    if (!_globals2.default.lmdown) currentTool = new _EraserTool.EraserTool(ctx);
  },
  70: function _() {
    if (!_globals2.default.lmdown) currentTool = new _FillTool.FillTool(ctx);
  },
  76: function _() {
    if (!_globals2.default.lmdown) currentTool = new _LineTool.LineTool(ctx);
  },
  90: function _(e) {
    if (e.ctrlKey) {
      (0, _undo2.default)();
    }
  },
  89: function _(e) {
    if (e.ctrlKey) {
      (0, _redo2.default)();
    }
  }
};

$(window).keydown(function (e) {
  console.log(e);
  if (keyBindings[e.keyCode]) {
    keyBindings[e.keyCode](e);
  }
});

$('canvas').bind('mousewheel', function (e) {
  console.log(e.originalEvent);
  var newScale = container.scale.x - e.originalEvent.wheelDeltaY / 120;

  if (newScale > 0) {
    container.scale.y = newScale;
    container.scale.x = newScale;
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
    canvasHistory.push(canvas.toDataURL());
    canvasFuture.splice(0, canvasFuture.length);
    var pos = floorPos(mouseData.data.getLocalPosition(sprite));
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 0) {
      _globals2.default.lmdown = true;
      currentTool.onLeftMouseDown(pos);
    }
  };

  sprite.mousemove = function (mouseData) {
    var pos = floorPos(mouseData.data.getLocalPosition(sprite));
    currentTool.onMouseMove(pos, mouseData.data.originalEvent);
  };

  container.mousedown = function (mouseData) {
    console.log(mouseData);
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 1) {
      _globals2.default.mmdown = true;
      $('html').css({ cursor: '-webkit-grabbing' });
    }
  };

  container.mouseup = function (mouseData) {
    var downButton = mouseData.data.originalEvent.button;

    if (downButton === 0) {
      _globals2.default.lmdown = false;
      currentTool.onLeftMouseUp();
    }
    if (downButton === 1) {
      _globals2.default.mmdown = false;
      $('html').css({ cursor: 'default' });
    }
  };

  sprite.mouseup = function (mouseData) {
    var downButton = mouseData.data.originalEvent.button;
    if (downButton === 0) {
      _globals2.default.lmdown = false;
      currentTool.onLeftMouseUp();
    }
  };

  container.mousemove = function (mouseData) {
    var origEvt = mouseData.data.originalEvent;

    if (_globals2.default.mmdown) {
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

},{"./globals":2,"./helpers/redo":3,"./helpers/undo":4,"./tools/EraserTool":6,"./tools/FillTool":7,"./tools/LineTool":8,"./tools/MoveTool":9,"./tools/PencilTool":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var canvas = document.createElement('canvas');

exports.default = {
  currentColor: '#000',
  mmdown: false,
  lmdown: false,
  container: new PIXI.Container(),
  canvasHistory: [],
  canvasFuture: [],
  canvas: canvas,
  ctx: canvas.getContext('2d')
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var redo = function redo() {
  var hist = undefined;
  var image = new Image();
  if (!_globals2.default.lmdown) {
    _globals2.default.canvasHistory.push(_globals2.default.canvas.toDataURL());
    hist = _globals2.default.canvasFuture.pop();
  }
  if (hist) {
    image.src = hist;
    image.onload = function () {
      _globals2.default.ctx.clearRect(0, 0, _globals2.default.canvas.width, _globals2.default.canvas.height);
      _globals2.default.ctx.drawImage(image, 0, 0);
    };
  }
};

exports.default = redo;

},{"../globals":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var undo = function undo() {
  var hist = undefined;
  var image = new Image();
  if (!_globals2.default.lmdown) {
    _globals2.default.canvasFuture.push(_globals2.default.canvas.toDataURL());
    hist = _globals2.default.canvasHistory.pop();
  }
  if (hist) {
    image.src = hist;
    image.onload = function () {
      _globals2.default.ctx.clearRect(0, 0, _globals2.default.canvas.width, _globals2.default.canvas.height);
      _globals2.default.ctx.drawImage(image, 0, 0);
    };
  }
};

exports.default = undo;

},{"../globals":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EraserTool = undefined;

var _PencilTool2 = require('./PencilTool');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EraserTool = exports.EraserTool = function (_PencilTool) {
  _inherits(EraserTool, _PencilTool);

  function EraserTool(ctx) {
    _classCallCheck(this, EraserTool);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(EraserTool).call(this, ctx));
  }

  _createClass(EraserTool, [{
    key: 'draw',
    value: function draw(pos) {
      this.ctx.clearRect(pos.x, pos.y, 1, 1);
    }
  }]);

  return EraserTool;
}(_PencilTool2.PencilTool);

},{"./PencilTool":10}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FillTool = undefined;

var _BaseTool2 = require('./BaseTool');

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

      var canvas = this.ctx.canvas,
          boundsRight = canvas.width,
          boundsBottom = canvas.height,
          pixelStack = [pos];

      var reachLeft = false,
          reachRight = false,
          cont = true,
          curColor = tinycolor(_globals2.default.currentColor).toRgb();

      curColor = [curColor.r, curColor.g, curColor.b, 255];

      if (curColor.toString() === this.startColor.toString()) {
        cont = false;
      }

      while (pixelStack.length && cont === true) {
        var thisPos = pixelStack.pop();

        reachLeft = false;
        reachRight = false;

        while (thisPos.y >= 0 && this.matchStartColor(thisPos)) {
          thisPos.y -= 1;
        }

        thisPos.y += 1;

        while (thisPos.y < boundsBottom && this.matchStartColor(thisPos)) {
          this.draw(thisPos, _globals2.default.currentColor);

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

          if (thisPos.x + 1 < boundsRight) {
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

},{"../globals":2,"./BaseTool":5}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineTool = undefined;

var _BaseTool2 = require('./BaseTool');

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

var _bresenham = require('bresenham');

var _bresenham2 = _interopRequireDefault(_bresenham);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineTool = exports.LineTool = function (_BaseTool) {
  _inherits(LineTool, _BaseTool);

  function LineTool(ctx) {
    _classCallCheck(this, LineTool);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LineTool).call(this, ctx));
  }

  _createClass(LineTool, [{
    key: 'draw',
    value: function draw(pos, color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(pos.x, pos.y, 1, 1);
    }
  }, {
    key: 'onLeftMouseDown',
    value: function onLeftMouseDown(pos) {
      if (this.tempCtx && this.tempCtx != null) {
        this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        _globals2.default.container.removeChild(this.sprite);
      }
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.ctx.canvas.width;
      this.canvas.height = this.ctx.canvas.height;
      this.tempCtx = this.canvas.getContext('2d');
      this.texture = PIXI.Texture.fromCanvas(this.canvas);
      this.sprite = new PIXI.Sprite(this.texture);
      _globals2.default.container.addChild(this.sprite);
      this.tempCtx.fillStyle = _globals2.default.currentColor;
      this.tempCtx.fillRect(pos.x, pos.y, 1, 1);
      this.oldPos = pos;

      this.docCanvas = document.body.appendChild(this.canvas);
      $(this.docCanvas).css({ width: '80px' });
      $(this.docCanvas).attr('class', 'imgPreview');
    }
  }, {
    key: 'onRightMouseDown',
    value: function onRightMouseDown(pos) {
      this.draw(pos, _globals2.default.currentColor);
      this.oldPos = pos;
    }
  }, {
    key: 'onLeftMouseUp',
    value: function onLeftMouseUp() {
      if (this.canvas) {
        this.ctx.drawImage(this.canvas, 0, 0);
        this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.oldPos = null;
      _globals2.default.container.removeChild(this.sprite);
      $(this.docCanvas).remove();
    }
  }, {
    key: 'onRightMouseUp',
    value: function onRightMouseUp() {
      this.oldPos = null;
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(pos) {
      if (_globals2.default.lmdown && (this.oldPos.x !== pos.x || this.oldPos.y !== pos.y)) {
        this.sprite.texture.update();
        this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _bresenham2.default)(this.oldPos.x, this.oldPos.y, pos.x, pos.y)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            this.tempCtx.fillStyle = _globals2.default.currentColor;
            this.tempCtx.fillRect(p.x, p.y, 1, 1);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }]);

  return LineTool;
}(_BaseTool2.BaseTool);

},{"../globals":2,"./BaseTool":5,"bresenham":11}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoveTool = undefined;

var _BaseTool2 = require('./BaseTool');

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MoveTool = exports.MoveTool = function (_BaseTool) {
  _inherits(MoveTool, _BaseTool);

  function MoveTool(ctx) {
    _classCallCheck(this, MoveTool);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MoveTool).call(this, ctx));
  }

  _createClass(MoveTool, [{
    key: 'onLeftMouseDown',
    value: function onLeftMouseDown() {
      $('html').css({ cursor: '-webkit-grabbing' });
    }
  }, {
    key: 'onLeftMouseUp',
    value: function onLeftMouseUp() {
      $('html').css({ cursor: 'default' });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(pos, mouseEvt) {
      if (_globals2.default.lmdown) {
        _globals2.default.container.x += mouseEvt.movementX;
        _globals2.default.container.y += mouseEvt.movementY;
      }
    }
  }]);

  return MoveTool;
}(_BaseTool2.BaseTool);

},{"../globals":2,"./BaseTool":5}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PencilTool = undefined;

var _BaseTool2 = require('./BaseTool');

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

var _bresenham = require('bresenham');

var _bresenham2 = _interopRequireDefault(_bresenham);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PencilTool = exports.PencilTool = function (_BaseTool) {
  _inherits(PencilTool, _BaseTool);

  function PencilTool(ctx) {
    _classCallCheck(this, PencilTool);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PencilTool).call(this, ctx));
  }

  _createClass(PencilTool, [{
    key: 'draw',
    value: function draw(pos, color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(pos.x, pos.y, 1, 1);
    }
  }, {
    key: 'onLeftMouseDown',
    value: function onLeftMouseDown(pos) {
      this.draw(pos, _globals2.default.currentColor);
      this.oldPos = pos;
    }
  }, {
    key: 'onRightMouseDown',
    value: function onRightMouseDown(pos) {
      this.draw(pos, _globals2.default.currentColor);
      this.oldPos = pos;
    }
  }, {
    key: 'onLeftMouseUp',
    value: function onLeftMouseUp() {
      this.oldPos = null;
    }
  }, {
    key: 'onRightMouseUp',
    value: function onRightMouseUp() {
      this.oldPos = null;
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(pos) {
      if (_globals2.default.lmdown && (this.oldPos.x !== pos.x || this.oldPos.y !== pos.y)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _bresenham2.default)(this.oldPos.x, this.oldPos.y, pos.x, pos.y)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            this.draw(p, _globals2.default.currentColor);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.oldPos = pos;
      }
    }
  }]);

  return PencilTool;
}(_BaseTool2.BaseTool);

},{"../globals":2,"./BaseTool":5,"bresenham":11}],11:[function(require,module,exports){
module.exports = function(x0, y0, x1, y1, fn) {
  if(!fn) {
    var arr = [];
    fn = function(x, y) { arr.push({ x: x, y: y }); };
  }
  var dx = x1 - x0;
  var dy = y1 - y0;
  var adx = Math.abs(dx);
  var ady = Math.abs(dy);
  var eps = 0;
  var sx = dx > 0 ? 1 : -1;
  var sy = dy > 0 ? 1 : -1;
  if(adx > ady) {
    for(var x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
      fn(x, y);
      eps += ady;
      if((eps<<1) >= adx) {
        y += sy;
        eps -= adx;
      }
    }
  } else {
    for(var x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
      fn(x, y);
      eps += adx;
      if((eps<<1) >= ady) {
        x += sx;
        eps -= ady;
      }
    }
  }
  return arr;
};

},{}]},{},[1])
//# sourceMappingURL=bundle.js.map
