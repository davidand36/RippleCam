/*
  Rippler.ts

  Makes waves
*/

import { sin, cos, tan, atan } from './fastTrig';
import Vector from './Vector';

type RippleSource = {
  pos: Vector,
  start: number,
  refractionShifts: number[],
};

type Linear = { // For linear transforms like y = a + b * x
  a: number,
  b: number,
};

type Scaling = {
  h: Linear, // horizontal
  v: Linear, // vertical
};

export default class Rippler {
  private sources: RippleSource[] = [];

  addSource(pos: Vector, start: number): void {
    this.sources.push({
      pos,
      start,
      refractionShifts: [],
    });
  }

  apply(srcCanvas: HTMLCanvasElement, destCanvas: HTMLCanvasElement, time: number) {
    const srcWidth = srcCanvas.width;
    const srcHeight = srcCanvas.height;
    const destWidth = destCanvas.width;
    const destHeight = destCanvas.height;
    const srcCtx = srcCanvas.getContext('2d');
    const destCtx = destCanvas.getContext('2d');
    const srcImgData = srcCtx.getImageData(0, 0, srcWidth, srcHeight);
    const destImgData = destCtx.createImageData(destWidth, destHeight);
    const scaling = this.computeScaling(srcWidth, srcHeight, destWidth, destHeight);
    const maxR = Math.ceil(Math.hypot(destWidth, destHeight))
    this.computeSourceRefractionShifts(time, maxR);

    for (let destY = 0; destY < destHeight; ++destY) {
      for (let destX = 0; destX < destWidth; ++destX) {
        const destPos = { x: destX, y: destY };
        let offset = { x: 0, y: 0 };
        for (const source of this.sources) {
          let v = Vector.subtract(destPos, source.pos);
          let r = Vector.magnitude(v);
          if (r != 0) {
            v = Vector.scalarMul((1.0 / r), v);
            r = Math.round(r);
            const shift = source.refractionShifts[ r ];
            const shiftVec = Vector.scalarMul(shift, v);
            offset = Vector.add(offset, shiftVec);
          }
        }
        const shiftedPos = Vector.add(destPos, offset);
        const srcPos = {
          x: Math.round(scaling.h.a + scaling.h.b * shiftedPos.x),
          y: Math.round(scaling.v.a + scaling.v.b * shiftedPos.y),
        };
        this.copyPixel(srcImgData, srcPos, destImgData, destPos);
      }
    }
    destCtx.putImageData(destImgData, 0, 0);
  }

  private computeScaling(sw: number, sh: number, dw: number, dh: number): Scaling {
    const margin = 0.1;
    let ha = margin * sw;
    let va = margin * sh;
    let hb = (1 - 2 * margin) * sw / dw;
    let vb = (1 - 2 * margin) * sh / dh;
    if (hb < vb) {
      va = sw / 2 - hb * dw / 2;
      vb = hb;
    } else if (vb < hb) {
      ha = sh / 2 - vb * dh / 2;
      hb = vb;
    }
    return {
      h: { a: ha, b: hb },
      v: { a: va, b: vb },
    };
  }

  private computeSourceRefractionShifts(time: number, maxR: number): void {
    const amp = 50.0;
    const omega = 20.0;
    const speed = 300.0;
    const duration = 4.0;
    const depth = 50.0;

    for (let s = 0; s < this.sources.length;) {
      if (time - this.sources[s].start < duration) {
        ++s;
      } else {
        this.sources.splice(s, 1);
      }
    }

    for (const source of this.sources) {
      const elapsed = time - source.start;
      source.refractionShifts.length = 0;
      for (let r = 0; r < maxR; ++r) {
        const t = elapsed - r / speed;
        if (t <= 0) {
          source.refractionShifts.push(0);
          continue;
        }
        const slope = (amp * omega / speed) * cos(omega * t) *
          (1 - t / duration);
        const incidentAngle = atan(slope);
        const refractionAngle = incidentAngle / 4.0;
        const refractionShift = depth * tan(refractionAngle);
        source.refractionShifts.push(refractionShift);
      }
    }
  }

  private copyPixel(srcData: ImageData, srcPos: Vector, destData: ImageData, destPos: Vector): void {
    const srcLoc = (srcPos.x + srcPos.y * srcData.width) * 4;
    const destLoc = (destPos.x + destPos.y * destData.width) * 4;
    destData.data[destLoc] = srcData.data[srcLoc];
    destData.data[destLoc + 1] = srcData.data[srcLoc + 1];
    destData.data[destLoc + 2] = srcData.data[srcLoc + 2];
    destData.data[destLoc + 3] = srcData.data[srcLoc + 3];
  }
}
