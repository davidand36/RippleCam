/*
  displayLoop.ts

  Sets up a continuous loop to update the display.
  NOTES:
  1. The updateFunction receives an argument giving the time in seconds since app started.
*/

type UpdateFunction = (nowSecs: number) => void;

let updateFunction: UpdateFunction | null = null;

export function startDisplayLoop(func: UpdateFunction): void {
  updateFunction = func;
  requestAnimationFrame(doLoop);
}

export function stopDisplayLoop(): void {
  updateFunction = null;
}

function doLoop(nowMillis: number): void {
  if (updateFunction) {
    updateFunction(nowMillis / 1000);
    requestAnimationFrame(doLoop);
  }
}
