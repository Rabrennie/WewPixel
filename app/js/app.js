// Code goes here
PIXI.loader.add('transparent', 'assets/transparent.png').load(setup);

var currentColor = '#000000'
var mmdown = false;
var lmdown = false;
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d');
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
var container = new PIXI.Container();
const docRenderer = document.body.appendChild(renderer.view);
const docCanvas = document.body.appendChild(canvas);


const c2 = document.createElement('canvas')
const ctx2 = c2.getContext('2d');

document.body.appendChild(c2)


$('#mainColor').spectrum({
  showPalette: true,
  clickoutFiresChange: true,
  disabled: false,
  move: (color) => {
    currentColor= color.toHexString(); // #ff0000
  }
});


function setup() {
  canvas.width = 20;
  canvas.height = 20;
  c2.width = 20;
  c2.height= 20;
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

  console.log(container)
  var sprite = new PIXI.Sprite(canvasTexture)
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

  $(docCanvas).attr('class','renderer');
  $(docCanvas).css({ width:'80px' })
  $(docCanvas).attr('class','imgPreview');

  requestAnimationFrame(animate);

  container.interactive = true;
  container.hitArea = new PIXI.Rectangle(-1000,-1000,2000,2000)


  sprite.mousedown = function(mouseData) {
    var lcp = mouseData.data.getLocalPosition(sprite);
    var downButton = mouseData.data.originalEvent.button
    if(downButton === 0) {
      lmdown = true;
      ctx.fillStyle = currentColor
      ctx.fillRect(Math.floor(lcp.x),Math.floor(lcp.y),1,1);
      sprite.texture.update()
    } else if(downButton === 1) {
      mmdown = true;
      $(docRenderer).css({ cursor:'-webkit-grabbing' })
    }
  }

  sprite.mousemove = function(mouseData) {
    var lcp = mouseData.data.getLocalPosition(sprite);
    if(lmdown) {
      ctx.fillStyle = currentColor
      ctx.fillRect(Math.floor(lcp.x),Math.floor(lcp.y),1,1);
      sprite.texture.update()
    }
  }

  container.mousedown = function(mouseData) {
    console.log(mouseData)
    var downButton = mouseData.data.originalEvent.button
    if(downButton === 1) {
      mmdown = true;
      $(docRenderer).css({ cursor:'-webkit-grabbing' })
    }
  }

  container.mouseup = function(mouseData) {
    var downButton = mouseData.data.originalEvent.button
    if(downButton === 0) {
      lmdown = false;
    }
    if(downButton === 1) {
      mmdown = false;
      $(docRenderer).css({ cursor:'default' })
    }
  }

  sprite.mouseup = function(mouseData) {
    var downButton = mouseData.data.originalEvent.button
    if(downButton === 0) {
      lmdown = false;
    }
    if(downButton === 1) {
      mmdown = false;
    }
  }

  container.mousemove = function(mouseData) {
    var origEvt = mouseData.data.originalEvent;

    if(mmdown) {
      container.x += origEvt.movementX;
      container.y += origEvt.movementY;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  // render the stage
  renderer.render(container);

}
