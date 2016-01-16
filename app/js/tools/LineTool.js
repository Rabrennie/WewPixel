import { BaseTool } from './BaseTool';
import globals from '../globals'
import bresenham from 'bresenham'

export class LineTool extends BaseTool {
  constructor(ctx) {
    super(ctx)
  }
  draw(pos, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(pos.x, pos.y,1,1);
  }
  onLeftMouseDown(pos) {

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.ctx.canvas.width;
    this.canvas.height = this.ctx.canvas.height;
    this.tempCtx = this.canvas.getContext('2d');
    this.texture = PIXI.Texture.fromCanvas(this.canvas);
    this.sprite = new PIXI.Sprite(this.texture);
    globals.container.addChild(this.sprite);
    this.tempCtx.fillStyle = globals.currentColor
    this.tempCtx.fillRect(pos.x, pos.y,1,1);
    this.oldPos = pos;

    this.docCanvas = document.body.appendChild(this.canvas)
    $(this.docCanvas).css({ width:'80px' })
    $(this.docCanvas).attr('class','imgPreview');
  }
  onRightMouseDown(pos) {
    this.draw(pos, globals.currentColor)
    this.oldPos = pos;
  }
  onLeftMouseUp() {
    this.ctx.drawImage(this.canvas, 0, 0);
    this.oldPos = null;
    globals.container.removeChild(this.sprite);
    this.tempCtx = null;
    this.texture = null;
    this.sprite = null;
  }
  onRightMouseUp() {
    this.oldPos = null;
  }
  onMouseMove(pos) {
    if(globals.lmdown && (this.oldPos.x !== pos.x || this.oldPos.y !== pos.y)) {
      this.sprite.texture.update()
      this.tempCtx.clearRect(0,0,this.canvas.width,this.canvas.height)
      for(const p of bresenham(this.oldPos.x, this.oldPos.y, pos.x, pos.y)) {
        this.tempCtx.fillStyle = globals.currentColor
        this.tempCtx.fillRect(p.x, p.y,1,1);
      }
    }
  }
}
