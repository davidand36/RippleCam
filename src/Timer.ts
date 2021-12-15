/*
  Timer.ts

  Time source that can be reset, paused, and restarted.
  1. systemTime is a time source based on the built-in Date() functionality.
     Naturally, it cannot be reset or paused.
  2. A timer can be based on any time source that provides getSeconds().
     By default, systemTime is used.
*/

type TimeSource = {
  getSeconds: () => number;
};

export const systemTime: TimeSource = {
  getSeconds() {
    return new Date().getTime() / 1000.0;
  }
}

export class Timer implements TimeSource {
  private startTime;
  private pauseTime = 0;

  constructor(private basis: TimeSource = systemTime) {
    this.startTime = basis.getSeconds();
  }

  getSeconds(): number {
    if (this.pauseTime !== 0) {
      return this.pauseTime - this.startTime;
    } else {
      return this.basis.getSeconds() - this.startTime;
    }
  }

  pause(): void {
    if (this.pauseTime === 0) {
      this.pauseTime = this.basis.getSeconds();
    }
  }

  resume(): void {
    if (this.pauseTime !== 0) {
      this.startTime += (this.basis.getSeconds() - this.pauseTime);
      this.pauseTime = 0;
    }
  }
}
