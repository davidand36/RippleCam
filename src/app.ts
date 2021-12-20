/*
  app.ts

  Main app logic
*/

import { setMessage } from './message';
import { Timer } from './Timer';
import { getCameraMediaStream } from './camera';
import { OffscreenCanvasProvider } from './OffscreenCanvasProvider';
import OffscreenVideo from './OffscrenVideo';
import OffscreenImage from './OffscreenImage';
import { addCanvasToContainer, resizeContainedCanvas, fillCanvas } from './canvas';
import Rippler from './Rippler';
import { startDisplayLoop, stopDisplayLoop } from './displayLoop';
import { getClickOffset  } from './events';
import fallbackVideo from '../assets/Fallback.mp4';
import fallbackImage from '../assets/AyaSofia.jpg';

export async function runApp(): Promise<void> {
  setMessage('Please allow this site to use your camera. Your data will not be sent over the Internet.', 'message');
  const startButton = document.getElementById('start');
  const canvasContainer = document.getElementById('canvasContainer');

  startButton.addEventListener('click', start);


  async function start(): Promise<void> {
    startButton.style.display = 'none';
    canvasContainer.style.display = 'block';

    let provider: OffscreenCanvasProvider;
    let offscreenCanvas: HTMLCanvasElement;

    const timer = new Timer();
    try {
      const stream = await getCameraMediaStream();
      const video = new OffscreenVideo(stream || fallbackVideo);
      offscreenCanvas = await video.start();
      provider = video;
    } catch (error) {
      const image = new OffscreenImage(fallbackImage);
      offscreenCanvas = await image.start();
      provider = image;
    }
    const onscreenCanvas = addCanvasToContainer('canvasContainer');
    resizeCanvas();
    const rippler = new Rippler();
    startDisplayLoop(update);
    onscreenCanvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('resize', resizeCanvas);
    provider.onended(handleEnded);
    setMessage('Click on the picture to make waves.', 'message');

    function update() {
      provider.update();
      rippler.apply(offscreenCanvas, onscreenCanvas, timer.getSeconds());
    }

    function handleCanvasClick(event: MouseEvent) {
      const pos = getClickOffset(event);
      const now = timer.getSeconds();
      rippler.addSource(pos, now);
    }

    function resizeCanvas() {
      const aspectRatio = offscreenCanvas.width / offscreenCanvas.height;
      resizeContainedCanvas(onscreenCanvas, aspectRatio);
    }

    function handleEnded() {
      stopDisplayLoop();
      fillCanvas(onscreenCanvas, 'white');
      setTimeout(() => {
        onscreenCanvas.remove();
        canvasContainer.style.display = 'none';
        startButton.style.display = 'inline-block';
        setMessage("Do it again, if you'd like.", 'message');
      }, 100);
    }
  }
}
