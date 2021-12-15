/*
  events.ts

  Event-related functions
*/

import Vector from './Vector';

export function getClickOffset(event: MouseEvent) {
  const element = event.currentTarget as Element;
  const eventPos = { x: event.clientX, y: event.clientY };
  const elRect = element.getBoundingClientRect();
  const elPos = { x: elRect.x, y: elRect.y };
  return Vector.subtract(eventPos, elPos);
}
