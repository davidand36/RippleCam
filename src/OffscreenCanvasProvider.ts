/*
  OffscreenCanvasSource.ts

  Interface to a source of an off-screen canvas
*/

export type CallbackFunction = (provider: OffscreenCanvasProvider) => void;

export interface OffscreenCanvasProvider {
  start(): Promise<HTMLCanvasElement>;
  update(): void;
  onended(callback: CallbackFunction): void;
}
