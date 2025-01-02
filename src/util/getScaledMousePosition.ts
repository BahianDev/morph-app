import { decimalUpToSeven } from "./decimalUpToSeven";
import Konva from "konva";


export const getScaledMousePosition = (
  stage: Konva.Stage,
  e: DragEvent | MouseEvent
) => {
  stage.setPointersPositions(e);
  const stageOrigin = stage.getAbsolutePosition();
  const mousePosition = stage.getPointerPosition();
  if (mousePosition) {
    return {
      x: decimalUpToSeven((mousePosition.x - stageOrigin.x) / stage.scaleX()),
      y: decimalUpToSeven((mousePosition.y - stageOrigin.y) / stage.scaleY()),
    };
  }
  return {
    x: 0,
    y: 0,
  };
};
