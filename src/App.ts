/*
  App.ts

  Main app logic
*/

import { getCameraMediaStream } from './camera';
import OffscreenVideo from './OffscrenVideo';
import { addCanvasToContainer, resizeContainedCanvas } from './canvas';
import Rippler from './Rippler';
import { startDisplayLoop } from './displayLoop';
import fallback from '../assets/Fallback.mp4';

export async function runApp(): Promise<void> {
  const stream = await getCameraMediaStream();
  const video = new OffscreenVideo(stream || fallback);
  const videoCanvas = await video.start();
  const onscreenCanvas = addCanvasToContainer('canvasContainer');
  resizeCanvas();
  const rippler = new Rippler();
  startDisplayLoop(update);
  onscreenCanvas.addEventListener('click', handleCanvasClick);
  window.addEventListener('resize', resizeCanvas);

  function update(now: number) {
    video.update();
    rippler.transform(videoCanvas, onscreenCanvas, now);
  }

  function handleCanvasClick(event: MouseEvent) {

  }

  function resizeCanvas() {
    const aspectRatio = videoCanvas.width / videoCanvas.height;
    resizeContainedCanvas(onscreenCanvas, aspectRatio);
  }
}
