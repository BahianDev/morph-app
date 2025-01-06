import { createCanvas, loadImage } from "canvas";

type GenerateImagePros = {
  layers: string[];
  width: number;
  height: number;
};

const getLayer = async (url: string) => {
  return await loadImage(url);
};

export const generateImage = async (props: GenerateImagePros) => {
  const { layers, width, height } = props;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const promises = layers.map((item) => getLayer(item));

  const images = await Promise.all(promises);

  images.forEach((image) => {
    ctx.drawImage(image, 0, 0, width, height);
  });

  console.log(canvas)

  return canvas.toBuffer("image/png");
};
