/*
  OffscreenVideo.ts

  Video that draws to an off-screen canvas
*/

type CallbackFunction = (video: OffscreenVideo) => void;

export default class OffscreenVideo {
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

  async start(): Promise<HTMLCanvasElement> {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        this.video.play();
        this.video.addEventListener('loadedmetadata', setupCanvas);
        this.video.addEventListener('ended', handleEnded);
      } catch (err) {
        reject(err);
      }

      function setupCanvas(): void {
        self.canvas = document.createElement('canvas');
        self.canvas.width = self.video.videoWidth;
        self.canvas.height = self.video.videoHeight;
        self.ctx = self.canvas.getContext('2d');
        resolve(self.canvas);
      }
    });

    function handleEnded(): void {
      self.ctx = null;
      self.canvas = null;
      self.video = null;
      if (self.endedCallback) {
        self.endedCallback(self);
      }
    }
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
