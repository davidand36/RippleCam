/*
  Vector.ts

  Two-dimensional vector class
*/

export default class Vector {
  constructor(public x: number, public y: number) {}

  static equal(vec1: Vector, vec2: Vector): boolean {
    return (vec1.x === vec2.x) && (vec1.y === vec2.y);
  }

  static add(vec1: Vector, vec2: Vector): Vector {
    return {
      x: vec1.x + vec2.x,
      y: vec1.y + vec2.y,
    }
  }

  static subtract(vec1: Vector, vec2: Vector): Vector {
    return {
      x: vec1.x - vec2.x,
      y: vec1.y - vec2.y,
    }
  }

  static scalarMul(scalar: number, vec: Vector): Vector {
    return {
      x: scalar * vec.x,
      y: scalar * vec.y,
    }
  }

  static magnitude(vec: Vector): number {
    return Math.hypot(vec.x, vec.y);
  }
}
