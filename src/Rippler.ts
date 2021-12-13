/*
  Rippler.ts

  Makes waves
*/

export default class Rippler {
  transform(srcCanvas: HTMLCanvasElement, destCanvas: HTMLCanvasElement, time: number) {
    const destCtx = destCanvas.getContext('2d');
    destCtx.drawImage(srcCanvas, 0, 0, destCanvas.width, destCanvas.height);
  }
}
