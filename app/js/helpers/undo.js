import globals from '../globals'

const undo = () => {
  let hist;
  const image = new Image;
  if(!globals.lmdown) {
    globals.canvasFuture.push(globals.canvas.toDataURL());
    hist = globals.canvasHistory.pop();
  }
  if(hist) {
    image.src = hist
    image.onload = function() {
      globals.ctx.clearRect(0,0,globals.canvas.width,globals.canvas.height)
      globals.ctx.drawImage(image, 0, 0)
    }
  }
}

export default undo;
