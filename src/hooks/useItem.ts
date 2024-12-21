import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useStageData } from "@/contexts/Stage";

type StageData = {
  id: string;
  attrs: OverrideItemData<any>;
  className: string;
  children?: StageData[];
};

export type ItemData = {
  "data-item-type": string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  draggable: boolean;
} & Record<string, any>;

export type ItemProps = {
  key: string;
  data: ItemData;
  e?: Event;
} & Record<string, any>;

export type OverrideItemProps<T> = Omit<ItemProps, keyof T> &
  T &
  Pick<ITEMS_CONTEXT, "onSelect">;

export type OverrideItemData<T> = Omit<ItemData, keyof T> & T;

export type ITEMS_CONTEXT = {
  selectedItems: Konva.Node[];
  onCreate: (newItem: StageData) => void;
  onDelete: (targetItemId: string | string[]) => void;
  onSelect: (e?: KonvaEventObject<MouseEvent>, itemList?: Konva.Node[]) => void;
  onClear: () => void;
  onAlter: (dataList: StageData[]) => void;
};

const useItem = () => {
  const { state, dispatch } = useStageData();

  const createItem = (newItem: StageData) => {
    dispatch({
      type: "ADD_ITEM",
      payload: newItem,
    });
  };

  const updateItem = (
    id: string,
    attrsFunc: (attrs: StageData["attrs"]) => StageData["attrs"]
  ) => {
    const targetItem = state.find(
      (data) => data.id === id || data.attrs.id === id
    );

    const updatedObject = {
      ...(targetItem ?? {}),
      attrs: {
        ...(targetItem ? targetItem.attrs : {}),
        ...attrsFunc(targetItem),
      },
    } as StageData;

    dispatch({
      type: "UPDATE_ITEM",
      payload: updatedObject,
    });
  };

  const removeItem = (targetItemId: string | string[]) => {
    dispatch({ type: "REMOVE_ITEM", payload: targetItemId });
  };
  const alterItems = (dataList: StageData[]) => {
    dispatch({ type: "CLEAR_ITEMS" });
    dispatch({
      type: "ADD_ITEM",
      payload: dataList,
    });
  };
  const clearItems = () => {
    dispatch({ type: "CLEAR_ITEMS" });
  };

  return {
    stageData: state,
    createItem,
    updateItem,
    removeItem,
    alterItems,
    clearItems,
  };
};

export default useItem;
