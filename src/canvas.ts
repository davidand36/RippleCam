/*
  canvas.js

  Routines for working with HTML Canvas.
*/

export function addCanvasToContainer(containerId: string): HTMLCanvasElement | null {
  const container = document.getElementById(containerId);
  if (container) {
    let canvas: HTMLCanvasElement;
    const canvases = container.getElementsByTagName('canvas');
    if (canvases.length > 0) {
      canvas = canvases[0];
    } else {
      canvas = document.createElement('canvas');
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      container.append(canvas);
    }
    return canvas;
  } else {
    console.error(`Element with ID "${containerId}" not found`);
    return null;
  }
}

export function resizeContainedCanvas(canvas: HTMLCanvasElement, aspectRatio: number): void {
  const container = canvas.parentElement;
  const outerContainer = container.parentElement;
  const maxWidth = outerContainer.clientWidth;
  const maxHeight = outerContainer.clientHeight;
  const newWidth = Math.min(maxHeight * aspectRatio, maxWidth);
  const newHeight = Math.min(maxWidth / aspectRatio, maxHeight);
  container.style.width = newWidth + 'px';
  container.style.height = newHeight + 'px';
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

export function fillCanvas(canvas: HTMLCanvasElement, color: string): void {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
