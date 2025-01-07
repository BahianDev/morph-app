import gifshot from "gifshot";
export function createGIF(
  images: Array<string>,
  options: object
): Promise<Function> {
  return new Promise((resolve, reject) => {
    gifshot.createGIF(
      {
        images,
        ...options,
      },
      (res: any) => {
        if (!res.error) resolve(res.image);
        else reject(res.error);
      }
    );
  });
}
