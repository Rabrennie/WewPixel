import { PencilTool } from './PencilTool';

export class EraserTool extends PencilTool {
  constructor(ctx) {
    super(ctx)
  }
  draw(pos) {
    this.ctx.clearRect(pos.x, pos.y,1,1);
  }

}
