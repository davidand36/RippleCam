/*
  Message.ts

  Sets message
*/

export function setMessage(message: string, elementId: string, error: boolean = false): void {
  const element = document.getElementById(elementId);
  element.textContent = message;
  if (error) {
    element.classList.add('message_error');
  } else {
    element.classList.remove('message_error');
  }
}
