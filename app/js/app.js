// Code goes here
var currentColor = '#000000'

$('#mainColor').spectrum({
  showPalette: true,
  clickoutFiresChange: true,
  disabled: false,
  move: (color) => {
    currentColor= color.toHexString(); // #ff0000
  }
});

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d');

canvas.width = 20;
canvas.height = 10;

ctx.fillStyle = 'white'
ctx.fillRect(0,0,canvas.width,canvas.height);
// middle mouse down
var mmdown = false;
var lmdown = false;

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
var container = new PIXI.Container();
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
const canvasTexture = PIXI.Texture.fromCanvas(canvas);

var sprite = new PIXI.Sprite(canvasTexture)
var hitArea = new PIXI.Rectangle(0, 0, 400, 300);

sprite.interactive = true;
hitArea.interactive = true;

container.addChild(sprite)
container.scale.x = 10;
container.scale.y = 10;
container.x = renderer.width/2 - canvas.width*10/2;
container.y = renderer.height/2 - canvas.height*10;
// add the renderer view element to the DOM
const docRenderer = document.body.appendChild(renderer.view);
const docCanvas = document.body.appendChild(canvas);
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


function animate() {
  requestAnimationFrame(animate);
  // render the stage
  renderer.render(container);

}
