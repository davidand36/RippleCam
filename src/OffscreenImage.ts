/*
  OffscreenImage.ts

  Image drawn to an off-scren canvas
*/

import { OffscreenCanvasProvider } from "./OffscreenCanvasProvider";

export default class OffscreenImage implements OffscreenCanvasProvider {
  private image: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(private source: string) {
    this.image = document.createElement('img');
  }

  start(): Promise<HTMLCanvasElement> {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        this.image.addEventListener('load', handleLoaded);
        this.image.src = this.source;
      } catch (error) {
        reject(error);
      }

      function handleLoaded(): void {
        self.canvas = document.createElement('canvas');
        self.canvas.width = self.image.naturalWidth;
        self.canvas.height = self.image.naturalHeight;
        self.ctx = self.canvas.getContext('2d');
        self.ctx.drawImage(self.image, 0, 0);
        resolve(self.canvas);
      }
    });
  }

  update(): void {
    // Nothing to do; the image only needed to be drawn once.
  }

  onended(): void {
    // Nothing to do; the image never ends.
  }
}
