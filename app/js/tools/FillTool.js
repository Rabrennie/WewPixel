import { BaseTool } from './BaseTool';
import globals from '../globals'

export class FillTool extends BaseTool {
  constructor(ctx) {
    super(ctx)
  }
  draw(pos, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(pos.x, pos.y,1,1);
  }
  onLeftMouseDown(pos) {
    this.startColor = this.ctx.getImageData(pos.x,pos.y,1,1).data;

    const canvas = this.ctx.canvas,
      boundsRight = canvas.width,
      boundsBottom = canvas.height,
      pixelStack = [pos];

    let reachLeft = false,
      reachRight = false,
      cont = true,
      curColor = (tinycolor(globals.currentColor)).toRgb();

    curColor = [curColor.r, curColor.g, curColor.b, 255]

    if(curColor.toString() === this.startColor.toString()) {
      cont = false;
    }

    while(pixelStack.length && cont === true) {
      const thisPos = pixelStack.pop();

      reachLeft = false;
      reachRight = false;

      while (thisPos.y >= 0 && this.matchStartColor(thisPos)) {
        thisPos.y -= 1;
      }

      thisPos.y += 1

      while (thisPos.y < boundsBottom && this.matchStartColor(thisPos)) {
        this.draw(thisPos, globals.currentColor)

        if(thisPos.x > 0) {
          if(this.matchStartColor({ x:thisPos.x-1, y:thisPos.y })) {
            if(!reachLeft) {
              pixelStack.push({ x:thisPos.x-1, y:thisPos.y })
              reachLeft = true;
            } else if(reachLeft) {
              reachLeft = false;
            }
          }
        }

        if(thisPos.x+1 < boundsRight) {
          if(this.matchStartColor({ x:thisPos.x+1, y:thisPos.y })) {

            if(!reachRight) {
              pixelStack.push({ x:thisPos.x+1, y:thisPos.y })
              reachRight = true;
            } else if(reachRight) {
              reachRight = false;
            }
          }
        }
        thisPos.y += 1;
      }
    }
  }
  matchStartColor(pos) {
    const newColor = this.ctx.getImageData(pos.x,pos.y,1,1).data
    if(newColor.toString() === this.startColor.toString()) {
      return true;
    }
    return false;
  }
}
