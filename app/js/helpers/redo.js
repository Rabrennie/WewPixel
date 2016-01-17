import globals from '../globals'

const redo = () => {
  let hist;
  const image = new Image;
  if(!globals.lmdown) {
    globals.canvasHistory.push(globals.canvas.toDataURL());
    hist = globals.canvasFuture.pop();
  }
  if(hist) {
    image.src = hist
    image.onload = function() {
      console.log(image)
      globals.ctx.clearRect(0,0,globals.canvas.width,globals.canvas.height)
      globals.ctx.drawImage(image, 0, 0)
    }
  }
}

export default redo;
