export function loadedImg(image: any) {
  return new Promise((resolve) => {
    image.onload = (e: any) => {
      resolve(e);
    };
  });
}
