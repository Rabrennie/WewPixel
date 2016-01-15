import { BaseTool } from './BaseTool';
import * as globals from '../globals'

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

    const pixelStack = [pos];
    let reachLeft = false,
      reachRight = false;

    while(pixelStack.length) {
      const thisPos = pixelStack.pop();

      reachLeft = false;
      reachRight = false;
      while (thisPos.y > 0 && this.matchStartColor(thisPos)) {
        thisPos.y -= 1;
      }

      while (thisPos.y < 20 && this.matchStartColor(thisPos)) {
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

        if(thisPos.x < 20) {
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
