/*
  App.ts

  Main app logic
*/

import { setMessage } from './message';
import { Timer } from './Timer';
import { getCameraMediaStream } from './camera';
import OffscreenVideo from './OffscrenVideo';
import { addCanvasToContainer, resizeContainedCanvas, fillCanvas } from './canvas';
import Rippler from './Rippler';
import { startDisplayLoop, stopDisplayLoop } from './displayLoop';
import fallback from '../assets/Fallback.mp4';
import { getClickOffset  } from './events';

export async function runApp(): Promise<void> {
  setMessage('Please allow this site to use your camera. Your data will not be sent over the Internet.', 'message');
  const startButton = document.getElementById('start');
  const canvasContainer = document.getElementById('canvasContainer');

  startButton.addEventListener('click', start);


  async function start(): Promise<void> {
    startButton.style.display = 'none';
    canvasContainer.style.display = 'block';

    const timer = new Timer();
    const stream = await getCameraMediaStream();
    const video = new OffscreenVideo(stream || fallback);
    const videoCanvas = await video.start();
    const onscreenCanvas = addCanvasToContainer('canvasContainer');
    resizeCanvas();
    const rippler = new Rippler();
    startDisplayLoop(update);
    onscreenCanvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('resize', resizeCanvas);
    video.onended(handleEnded);
    setMessage('Click on the video to make waves.', 'message');

    function update() {
      video.update();
      rippler.apply(videoCanvas, onscreenCanvas, timer.getSeconds());
    }

    function handleCanvasClick(event: MouseEvent) {
      const pos = getClickOffset(event);
      const now = timer.getSeconds();
      rippler.addSource(pos, now);
    }

    function resizeCanvas() {
      const aspectRatio = videoCanvas.width / videoCanvas.height;
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
