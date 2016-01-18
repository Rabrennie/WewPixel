import { BaseTool } from './BaseTool';
import globals from '../globals'

export class MoveTool extends BaseTool {
  constructor(ctx) {
    super(ctx)
  }
  onLeftMouseDown() {
    $('html').css({ cursor:'-webkit-grabbing'  })
  }
  onLeftMouseUp() {
    $('html').css({ cursor:'default' })
  }
  onMouseMove(pos, mouseEvt) {
    if(globals.lmdown) {
      globals.container.x += mouseEvt.movementX;
      globals.container.y += mouseEvt.movementY;
    }
  }
}
