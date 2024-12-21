import Konva from "konva";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import { decimalUpToSeven } from "../../../util/decimalUpToSeven";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { OverrideItemProps } from "@/hooks/useItem";
import useStage from "@/hooks/useStage";
import { StageData } from "@/contexts/Stage";

export type ImageItemKind = {
  "data-item-type": string;
  id: string;
  name: string;
  src: string;
  image: typeof Image;
};

export type ImageItemProps = OverrideItemProps<{
  data: StageData;
  e?: DragEvent;
}>;

const ImageItem: React.FC<ImageItemProps> = ({ data, e, onSelect }) => {
  const { attrs } = data;
  const imageRef = useRef() as RefObject<Konva.Image>;
  const [imageSrc, setImageSrc] = useState<CanvasImageSource>(new Image());

  const stage = useStage();
  const { onDragMoveFrame, onDragEndFrame, checkIsInFrame } = useDragAndDrop(
    stage.stageRef
  );

  useEffect(() => {
    const newImage = new Image();
    newImage.onload = () => {
      setImageSrc(newImage);

      // Posicionar a imagem no centro
      const stageWidth = stage.stageRef.current?.width() || 0;
      const stageHeight = stage.stageRef.current?.height() || 0;

      let width, height, x, y;
      if (newImage.width > newImage.height) {
        width = decimalUpToSeven(500);
        height = decimalUpToSeven(width * (newImage.height / newImage.width));
      } else {
        height = decimalUpToSeven(500);
        width = decimalUpToSeven(height * (newImage.width / newImage.height));
      }

      // Calcula a posição central
      x = (stageWidth - width) / 2;
      y = (stageHeight - height) / 2;
      console.log(data.attrs);

      data.attrs.x = x;
      data.attrs.y = y;
      data.attrs.width = width;
      data.attrs.height = height;
    };
    newImage.crossOrigin = "Anonymous";
    let source;
    if (attrs.src.startsWith("find:")) {
      source = attrs.src;
    } else {
      source = attrs.src;
    }
    if (source.startsWith("data:")) {
      Konva.Image.fromURL(source, (imageNode: Konva.Image) => {
        let width;
        let height;
        if (imageNode.width() > imageNode.height()) {
          width = decimalUpToSeven(500);
          height = decimalUpToSeven(
            width * (imageNode.height() / imageNode.width())
          );
        } else {
          height = decimalUpToSeven(500);
          width = decimalUpToSeven(
            height * (imageNode.width() / imageNode.height())
          );
        }
        imageNode.width(width);
        imageNode.height(height);
        const newBase64 = imageNode.toDataURL({
          x: 0,
          y: 0,
          width,
          height,
          pixelRatio: 1,
        });
        newImage.src = newBase64;
      });
      return;
    }
    newImage.src = source;
  }, [attrs.src]);

  useEffect(() => {
    if (imageRef.current) {
      stage.setStageRef(imageRef.current!.getStage()!);
      imageRef.current.brightness(data.attrs.brightness);
      checkIsInFrame(imageRef.current);
      imageRef.current.cache();
    }
  }, [imageSrc, data]);

  useEffect(() => {
    imageRef.current!.cache();
  }, []);

  return (
    <KonvaImage
      ref={imageRef}
      image={imageSrc}
      onClick={onSelect}
      name="label-target"
      data-item-type="image"
      data-frame-type="image"
      id={data.id}
      x={attrs.x}
      y={attrs.y}
      width={500}
      height={500}
      scaleX={attrs.scaleX}
      scaleY={attrs.scaleY}
      rotation={attrs.rotation ?? 0}
      draggable={attrs.src.endsWith(".gif")? false : true}
      onDragMove={onDragMoveFrame}
      onDragEnd={onDragEndFrame}
    />
  );
};

export default ImageItem;
