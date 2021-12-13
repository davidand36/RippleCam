/*
  Camera.ts

  Manages the device's camera
*/

export async function getCameraMediaStream(): Promise<MediaStream | null> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
    });
  } catch (error) {
    console.log('Error getting user media', error);
    return null;
  }
}
