"use client";

import ImageThumbnail from "@/config/ImageThumbnail";
import { StageData } from "@/contexts/Stage";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import useItem from "@/hooks/useItem";
import useSelection from "@/hooks/useSelection";
import useStage from "@/hooks/useStage";
import useTransformer from "@/hooks/useTransformer";
import { api } from "@/services/api";
import { Meme } from "@/types";
import Drop from "@/util/Drop";
import ImageItem, { ImageItemProps } from "@/view/object/image";
import { KonvaEventObject } from "konva/lib/Node";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { getScaledMousePosition } from "@/util/getScaledMousePosition";


export default function Memes() {
  const sections = ["Stickers", "GIFs"];

  const [tab, setTab] = useState("Stickers");
  const transformer = useTransformer();

  const { onSelectItem, clearSelection } =
    useSelection(transformer);

  const { stageRef } = useStage();
  const { onDropOnStage } = useDragAndDrop(stageRef);
  const { stageData } = useItem();

  const sortedStageData = useMemo(
    () =>
      stageData.sort((a, b) => {
        if (a.attrs.zIndex === b.attrs.zIndex) {
          if (a.attrs.zIndex < 0) {
            return b.attrs.updatedAt - a.attrs.updatedAt;
          }
          return a.attrs.updatedAt - b.attrs.updatedAt;
        }
        return a.attrs.zIndex - b.attrs.zIndex;
      }),
    [stageData]
  );

  const [container, setContainer] = useState<HTMLDivElement>();

  const setStateSizeToFitIn = useCallback(() => {
    if (!stageRef.current || !stageRef.current.container().parentElement) {
      return;
    }
    stageRef.current.width(500);
    stageRef.current.height(500);
    stageRef.current.batchDraw();
    stageRef.current.container().style.backgroundColor = "#D9D9D9";
  }, [stageRef]);

  useEffect(() => {
    window.addEventListener("load", setStateSizeToFitIn);
    window.addEventListener("resize", setStateSizeToFitIn);
    return () => window.removeEventListener("resize", setStateSizeToFitIn);
  }, [setStateSizeToFitIn]);

  useEffect(() => {
    if (stageRef.current) {
      setContainer(stageRef.current!.container());
    }
  }, []);

  const onSelectEmptyBackground = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.target.getType() === "Stage" && onSelectItem(e);
    },
    [onSelectItem]
  );

  const onMouseDownOnStage = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      onSelectEmptyBackground(e);
      const stage = e.target.getStage();
      if (!stage) {
        return;
      }

      const selectBox = stage.findOne(".select-box");
      const scaledCurrentMousePos = getScaledMousePosition(stage, e.evt);
      const currentMousePos = stage.getPointerPosition();
      if (selectBox) {
        selectBox.position(scaledCurrentMousePos);
        if (
          stage.getAllIntersections(currentMousePos).length ||
          stageRef.current?.draggable()
        ) {
          selectBox.visible(false);
          return;
        }
        selectBox.visible(true);
      }
    },
    [onSelectEmptyBackground]
  );

  const renderObject = (item: StageData) => {
    switch (item.attrs["data-item-type"]) {
      case "image":
        return (
          <ImageItem
            key={`image-${item.id}`}
            data={item as ImageItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      default:
        return null;
    }
  };

  const { data: memes } = useQuery({
    queryKey: ["memes-list"],
    queryFn: (): Promise<Meme[]> =>
      api.get(`memes?populate=*`).then((response) => response.data.data),
    refetchOnWindowFocus: false,
    initialData: [],
  });

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen py-8">
      <main className="flex flex-col gap-8 items-start justify-start w-full">
        <span className="font-medium text-2xl self-start">
          Morph your Morphy, download or mint on-chain to rep on socials.
          Simple!
        </span>
        <div className="flex space-x-5 flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:flex-row w-full gap-5">
            <div className="bg-custom-gray rounded-xl relative w-[500px] h-[500px]">
              <Stage
                ref={stageRef}
                onMouseDown={onMouseDownOnStage}
                width={500}
                height={500}
                draggable={false}
              >
                <Layer>
                  {stageData.length
                    ? sortedStageData.map((item) => renderObject(item))
                    : null}

                  <Transformer
                    ref={transformer.transformerRef}
                    keepRatio
                    shouldOverdrawWholeArea
                    boundBoxFunc={(_, newBox) => newBox}
                    onTransformEnd={transformer.onTransformEnd}
                  />
                </Layer>
                {container ? (
                  <Drop callback={onDropOnStage} targetDOMElement={container} />
                ) : null}
              </Stage>
            </div>
            <div className="bg-custom-gray rounded-xl h-full lg:flex-1">
              <div className="flex overflow-x-scroll gap-8 items-center px-4 bg-tamber-gray h-16 w-full rounded-t-xl">
                {sections.map((section, key) => (
                  <div
                    onClick={() => setTab(section)}
                    key={key}
                    className={`${
                      tab === section
                        ? "text-white border-b-4 border-solid transition-all duration-300 "
                        : ""
                    } h-full flex items-center cursor-pointer`}
                  >
                    <span className="font-bold">{section}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-8 flex gap-8 flex-wrap">
                {memes.length > 0 &&
                  memes
                    .filter((trait) => trait.type === tab)
                    .map((trait, key) => (
                      <div
                        key={key}
                        onClick={clearSelection}
                        className={`border border-gray-500 w-24 h-24 rounded-lg cursor-pointer`}
                      >
                        <ImageThumbnail
                          src={`http://localhost:1337${trait.image[0].url}`}
                        />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="focus:outline-none text-black border-2 border-black bg-transparent font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2">
            RESET
          </button>
          <button className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2">
            DOWNLOAD
          </button>
          <button className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2">
            MORPH
          </button>
        </div>
      </main>
    </div>
  );
}
