import * as globals from '../globals'

export class pencilTool {
  constructor(ctx) {
    this.ctx = ctx
  }
  draw(pos, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(pos.x, pos.y,1,1);
  }
  onLeftMouseDown(pos) {
    this.draw(pos, globals.currentColor)
  }
  onRightMouseDown(pos) {
    this.draw(pos, globals.currentColor)
  }
  onLeftMouseUp() {
  }
  onRightMouseUp() {
  }
  onMouseMove(pos) {
    if(globals.lmdown) {
      this.draw(pos, globals.currentColor)
    }
  }
}
