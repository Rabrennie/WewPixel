const canvas = document.createElement('canvas');

export default {
  currentColor: '#000',
  mmdown: false,
  lmdown: false,
  container: new PIXI.Container(),
  canvasHistory: [],
  canvasFuture: [],
  canvas,
  ctx: canvas.getContext('2d')
}
