/*
  fastTrig.ts

  Low-accuracy trig functions using table look-up
*/

let sinTab: number[] = [];
let cosTab: number[] = [];
let tanTab: number[] = [];
let atanTab: number[] = [];

for (let i = 0; i < 630; ++i) {
  sinTab.push(Math.sin(i / 100));
  cosTab.push(Math.cos(i / 100));
  tanTab.push( Math.tan(i / 100));
}
for (let i = 0; i < 101; ++i) {
  atanTab.push(Math.atan(i / 100));
}

export function sin(x: number): number {
  return sinTab[ angleToInt100(x) ];
}

export function cos(x: number): number {
  return cosTab[ angleToInt100(x) ];
}

export function tan(x: number): number {
  return tanTab[ angleToInt100(x) ];
}

export function atan(x: number): number {
  const sign = Math.sign(x);
  x = Math.abs(x);
  const recip = x > 1;
  if (recip) {
    x = 1 / x;
  }
  let arct = atanTab[ Math.round(x * 100) ];
  if (recip) {
    arct = Math.PI / 2 - arct;
  }
  return sign * arct;
}

function angleToInt100(x: number): number {
  while (x < 0)
    x += 2 * Math.PI;
  while (x >= 2 * Math.PI)
    x -= 2 * Math.PI;
  return Math.round(x * 100);
}
