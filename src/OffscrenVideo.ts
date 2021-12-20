/*
  OffscreenVideo.ts

  Video that draws to an off-screen canvas
*/

import { CallbackFunction, OffscreenCanvasProvider } from "./OffscreenCanvasProvider";

export default class OffscreenVideo implements OffscreenCanvasProvider {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private endedCallback: CallbackFunction;

  constructor(source: string | MediaStream ) {
    this.video = document.createElement('video');
    if (typeof source === 'string') {
      this.video.src = source;
    } else {
      this.video.srcObject = source;
    }
  }

  start(): Promise<HTMLCanvasElement> {
    const self = this;
    return new Promise((resolve, reject) => {
      self.video.addEventListener('loadedmetadata', setupCanvas);
      self.video.addEventListener('ended', handleEnded);
      self.video.play()
        .catch(reject);

      function setupCanvas(): void {
        self.canvas = document.createElement('canvas');
        self.canvas.width = self.video.videoWidth;
        self.canvas.height = self.video.videoHeight;
        self.ctx = self.canvas.getContext('2d');
        resolve(self.canvas);
      }

      function handleEnded(): void {
        self.ctx = null;
        self.canvas = null;
        self.video = null;
        if (self.endedCallback) {
          self.endedCallback(self);
        }
      }
    });
  }

  update(): void {
    if (this.ctx) {
      this.ctx.drawImage(this.video, 0, 0);
    }
  }

  onended(callback: CallbackFunction): void {
    this.endedCallback = callback;
  }
}
