import globals from './globals'
import { FillTool } from './tools/FillTool';
import { PencilTool } from './tools/PencilTool';
import { EraserTool } from './tools/EraserTool';
import { LineTool } from './tools/LineTool';
import { MoveTool } from './tools/MoveTool';
import redo from './helpers/redo'
import undo from './helpers/undo'

const canvas = globals.canvas,
  ctx = globals.ctx,
  renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight),
  container = globals.container,
  docRenderer = document.body.appendChild(renderer.view),
  docCanvas = document.body.appendChild(canvas),
  c2 = document.createElement('canvas'),
  ctx2 = c2.getContext('2d'),
  canvasHistory = globals.canvasHistory,
  // WHERE WE'RE GOING WE DON'T NEED ROADS
  canvasFuture = globals.canvasFuture;

let sprite,
  currentTool = new MoveTool(ctx);

document.body.appendChild(c2)

$('#mainColor').spectrum({
  color:globals.currentColor,
  showPalette: true,
  clickoutFiresChange: true,
  disabled: false,
  move: (color) => {
    globals.currentColor= color.toHexString(); // #ff0000
  }
});

$('#pencilBtn').click(() => {
  currentTool = new PencilTool(ctx);
})

$('#fillBtn').click(() => {
  currentTool = new FillTool(ctx);
})

$('#eraserBtn').click(() => {
  currentTool = new EraserTool(ctx);
})

$('#lineBtn').click(() => {
  currentTool = new LineTool(ctx);
})

$('#moveBtn').click(() => {
  currentTool = new MoveTool(ctx);
})

const keyBindings = {
  66: () => { if(!globals.lmdown) currentTool = new PencilTool(ctx); },
  69: () => { if(!globals.lmdown) currentTool = new EraserTool(ctx); },
  70: () => { if(!globals.lmdown) currentTool = new FillTool(ctx); },
  76: () => { if(!globals.lmdown) currentTool = new LineTool(ctx); },
  90: (e) => { if(e.ctrlKey) { undo() } },
  89: (e) => { if(e.ctrlKey) { redo() } }
}

$(window).keydown(function(e) {
  console.log(e)
  if(keyBindings[e.keyCode]) {
    keyBindings[e.keyCode](e);
  }
});

$('canvas').bind('mousewheel', function(e) {
  console.log(e.originalEvent)
  const newScale = container.scale.x - e.originalEvent.wheelDeltaY/120;

  if(newScale > 0) {
    container.scale.y = newScale;
    container.scale.x = newScale;
  }

});

setup()

function setup() {
  canvas.width = c2.width = 20;
  canvas.height = c2.height = 20;

  console.log(PIXI.loader)
  ctx2.fillStyle = 'white'
  ctx2.fillRect(0,0,20,20);
  for (var i = 0; i <= canvas.height; i++) {
    for (var x = 0; x <= canvas.width; x++) {
      if ((x+i) % 2 === 0) {
        ctx2.fillStyle = 'white'
      } else {
        ctx2.fillStyle = '#E0E0E0'
      }

      ctx2.fillRect(x,i,1,1);
    }
  }
  // ctx.fillStyle = 'white'
  // ctx.fillRect(0,0,canvas.width,canvas.height);

  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  const canvasTexture = PIXI.Texture.fromCanvas(canvas);
  const c2text = PIXI.Texture.fromCanvas(c2);
  renderer.backgroundColor = 0xBABABA;

  sprite = new PIXI.Sprite(canvasTexture)
  sprite.interactive = true;

  var tilingSprite = new PIXI.Sprite(c2text)
  console.log(tilingSprite)
  container.addChild(tilingSprite)
  container.addChild(sprite)
  container.scale.x = 10;
  container.scale.y = 10;
  container.x = renderer.width/2 - canvas.width*10/2;
  container.y = renderer.height/2 - canvas.height*10;
  // add the renderer view element to the DOM

  $(docRenderer).attr('class','renderer');
  $(docCanvas).css({ width:'80px' })
  $(docCanvas).attr('class','imgPreview');

  requestAnimationFrame(animate);

  container.interactive = true;
  container.hitArea = new PIXI.Rectangle(-1000,-1000,2000,2000)


  function floorPos(pos) {
    return { x:Math.floor(pos.x), y:Math.floor(pos.y) };
  }

  sprite.mousedown = function(mouseData) {
    canvasHistory.push(canvas.toDataURL());
    canvasFuture.splice(0, canvasFuture.length);
    const pos = floorPos(mouseData.data.getLocalPosition(sprite))
    var downButton = mouseData.data.originalEvent.button;
    if(downButton === 0) {
      globals.lmdown = true;
      currentTool.onLeftMouseDown(pos);
    }
  }

  sprite.mousemove = function(mouseData) {
    const pos = floorPos(mouseData.data.getLocalPosition(sprite))
    currentTool.onMouseMove(pos, mouseData.data.originalEvent);
  }

  container.mousedown = function(mouseData) {
    console.log(mouseData)
    var downButton = mouseData.data.originalEvent.button
    if(downButton === 1) {
      globals.mmdown = true;
      $('html').css({ cursor:'-webkit-grabbing' })
    }
  }

  container.mouseup = function(mouseData) {
    var downButton = mouseData.data.originalEvent.button

    if(downButton === 0) {
      globals.lmdown = false;
      currentTool.onLeftMouseUp();
    }
    if(downButton === 1) {
      globals.mmdown = false;
      $('html').css({ cursor:'default' })
    }
  }

  sprite.mouseup = function(mouseData) {
    var downButton = mouseData.data.originalEvent.button
    if(downButton === 0) {
      globals.lmdown = false;
      currentTool.onLeftMouseUp();
    }
  }

  container.mousemove = function(mouseData) {
    var origEvt = mouseData.data.originalEvent;

    if(globals.mmdown) {
      container.x += origEvt.movementX;
      container.y += origEvt.movementY;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  // render the stage
  sprite.texture.update()
  renderer.render(container);

}
