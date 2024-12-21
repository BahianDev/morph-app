import Konva from "konva";

import { decimalUpToSeven } from "./decimalUpToSeven";

export const getFramePos = (
  stage: Konva.Stage,
  e: DragEvent,
  width?: number,
  height?: number
) => {
  stage.setPointersPositions(e);
  const stageOrigin = stage.getAbsolutePosition();
  const mousePosition = stage.getPointerPosition();
  if (!mousePosition) {
    return {
      x: 0,
      y: 0,
    };
  }
  if (!width || !height) {
    return {
      x: decimalUpToSeven(mousePosition.x - stageOrigin.x),
      y: decimalUpToSeven(mousePosition.y - stageOrigin.y),
    };
  }
  return {
    x: decimalUpToSeven(
      (mousePosition.x - stageOrigin.x) / stage.scaleX() - width / 2
    ),
    y: decimalUpToSeven(
      (mousePosition.y - stageOrigin.y) / stage.scaleY() - height / 2
    ),
  };
};
