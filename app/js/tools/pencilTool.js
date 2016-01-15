import { BaseTool } from './BaseTool';
import * as globals from '../globals'
import bresenham from 'bresenham'

export class PencilTool extends BaseTool {
  constructor(ctx) {
    super(ctx)
  }
  draw(pos, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(pos.x, pos.y,1,1);
  }
  onLeftMouseDown(pos) {
    this.draw(pos, globals.currentColor)
    this.oldPos = pos;
  }
  onRightMouseDown(pos) {
    this.draw(pos, globals.currentColor)
    this.oldPos = pos;
  }
  onLeftMouseUp() {
    this.oldPos = null;
  }
  onRightMouseUp() {
    this.oldPos = null;
  }
  onMouseMove(pos) {
    if(globals.lmdown && (this.oldPos.x !== pos.x || this.oldPos.y !== pos.y)) {
      for(const p of bresenham(this.oldPos.x, this.oldPos.y, pos.x, pos.y)) {
        this.draw(p, globals.currentColor);
      }
      this.oldPos = pos;
    }
  }
}
