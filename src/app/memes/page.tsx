"use client";

import ImageThumbnail from "@/config/ImageThumbnail";
import { api } from "@/services/api";
import { Meme } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Canvas, Control, FabricImage, FabricObject, Textbox } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import SuperGif from "libgif";
import { loadedImg } from "@/config/loadedImg";
import { canvasToFile } from "@/util/canvasToFile";
import { deleteIcon } from "@/util/deleteIcon";
import { renderIcon } from "@/util/renderIcon";
import { createGIF } from "@/util/createGIF";
import { base64ToBlob } from "@/util/base64ToBlob";
import axios from "axios";

export default function Memes() {
  const canvasRef = useRef<any>(null);
  const sections = ["Background", "Stickers", "GIFs"];

  const [canvas, setCanvas] = useState<any>(null);
  const [canvasImages, setCanvasImages] = useState<any[]>([]);
  const [gifInterval, setGifInverval] = useState<number>(41);

  const [tab, setTab] = useState("Background");

  const imgOptions: any = {
    selectable: false,
    visible: false,
    originX: "left",
    originY: "top",
  };

  const handleDeleteActiveObject = useCallback(() => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      if (activeObject instanceof Textbox && activeObject.isEditing) {
        return;
      }
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  }, [canvas]);

  const applyCustomControlsToObject = (object: FabricObject) => {
    object.controls.deleteControl = new Control({
      x: 0.5,
      y: -0.5,
      offsetY: -15,
      offsetX: 20,
      cursorStyle: "pointer",
      render: (ctx, left, top) => renderIcon(ctx, left, top, deleteIcon),
      mouseUpHandler: handleDeleteActiveObject,
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
        selectionBorderColor: "#14A800",
        selectionColor: "#14A800",
      });

      initCanvas.backgroundColor = "transparent";

      initCanvas.renderAll();
      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const handleAddGif = async (url: string) => {
    const imgEl = document.createElement("img");
    imgEl.setAttribute("rel:animated_src", url);
    imgEl.setAttribute("rel:auto_play", "0");
    const div = document.createElement("div");
    div.appendChild(imgEl);

    const gif = new SuperGif({ gif: imgEl });
    let images: string[] = [];
    let i: number = 0;

    const image = new Image();
    image.src = url;
    image.crossOrigin = "anonymous";
    await loadedImg(image);

    const { width } = image;

    const scale: number = 500 / width;

    Object.assign(imgOptions, { scaleX: scale, scaleY: scale });

    gif.load(async () => {
      const interval = gif.get_duration_ms() / gif.get_length();
      setGifInverval(interval);

      for (let i: number = 1; i <= gif.get_length(); i++) {
        gif.move_to(i);
        const file = canvasToFile(gif.get_canvas(), `gif-${i}`);
        images.push(URL.createObjectURL(file));
      }

      let canvasImages: any[] = [];

      for (let j = 0; j < images.length; j++) {
        const imgElement = new Image();
        imgElement.src = images[j];
        imgElement.crossOrigin = "anonymous";
        const img = new FabricImage(imgElement, imgOptions);

        const loadImageOptions = { crossOrigin: "anonymous", ...imgOptions };
        await img.setSrc(images[j], loadImageOptions);

        canvas.add(img);
        canvas.setActiveObject(img);

        canvasImages.push(img);
      }

      images.splice(0);

      setInterval(() => {
        if (i >= canvasImages.length) i = 0;
        const tempCanvasImages = [];
        for (const index of canvasImages.keys()) {
          let visible: boolean = false;
          if (index === i) visible = true;
          canvasImages[index].setOptions({
            visible,
          });

          tempCanvasImages.push(canvasImages[index]);
        }
        setCanvasImages(tempCanvasImages);
        i++;

        try {
          canvas?.renderAll();
        } catch (e) {
          console.log(e);
        }
      }, interval);
    });
  };

  const handleAddStikcer = async (url: string) => {
    FabricImage.fromURL(url, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const oImg = img;
      oImg.set({ left: 20, top: 20 });
      oImg.scale(0.1);
      oImg.borderColor = "#14A800";
      oImg.borderScaleFactor = 2;
      oImg.cornerColor = "#14A800";
      applyCustomControlsToObject(oImg);
      canvas.add(oImg);
      canvas.setActiveObject(oImg);
    });
  };

  const handleDownload = useCallback(async () => {
    let i = 0;
    const dataImages: Array<any> = [];
    let imageGenerated: any;

    const processFrames = async (): Promise<void> => {
      return new Promise((resolve) => {
        const processFrame = async () => {
          if (i >= canvasImages.length) {
            try {
              const gif = await createGIF(dataImages, {
                gifWidth: 1080,
                gifHeight: (1080 * 1080) / 1080,
                interval: gifInterval / 1 / 1000,
                sampleInterval: 10,
                progressCallback: (progress: number) => {},
              });
              imageGenerated = gif;
              dataImages.length = 0;
            } catch (e) {
              console.error("Erro ao criar o GIF:", e);
            }
            resolve();
            return;
          }

          for (const index of canvasImages.keys()) {
            canvasImages[index].set("visible", index === i);
          }

          try {
            dataImages.push(canvas.toDataURL());
          } catch (e) {
            console.error("Erro ao capturar o frame:", e);
          }

          i++;
          setTimeout(processFrame, 40);
        };

        processFrame();
      });
    };

    await processFrames();

    const el = document.createElement("a");
    el.href = URL.createObjectURL(base64ToBlob(imageGenerated));
    el.download = "headphone.gif";
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }, [canvasImages, canvas, gifInterval]);

  const handleMorph = useCallback(async () => {
    let i = 0;
    const dataImages: Array<any> = [];
    let imageGenerated: any;

    const processFrames = async (): Promise<void> => {
      return new Promise((resolve) => {
        const processFrame = async () => {
          if (i >= canvasImages.length) {
            try {
              const gif = await createGIF(dataImages, {
                gifWidth: 1080,
                gifHeight: (1080 * 1080) / 1080,
                interval: gifInterval / 1 / 1000,
                sampleInterval: 10,
                progressCallback: (progress: number) => {},
              });
              imageGenerated = gif;
              dataImages.length = 0;
            } catch (e) {
              console.error("Erro ao criar o GIF:", e);
            }
            resolve();
            return;
          }

          for (const index of canvasImages.keys()) {
            canvasImages[index].set("visible", index === i);
          }

          try {
            dataImages.push(canvas.toDataURL());
          } catch (e) {
            console.error("Erro ao capturar o frame:", e);
          }

          i++;
          setTimeout(processFrame, 40);
        };

        processFrame();
      });
    };

    await processFrames();

    try {
      const formData = new FormData();
      formData.set("file", base64ToBlob(imageGenerated));

      const response = await axios.post("/memes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("GIF enviado com sucesso:", response.data);
      } else {
        console.error("Erro ao enviar o GIF:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro na solicitação Axios:",
          error.response?.data || error.message
        );
      } else {
        console.error("Erro inesperado:", error);
      }
    }
  }, [canvasImages, canvas, gifInterval]);

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
              <div className="canvas_w">
                <canvas ref={canvasRef} className="absolute inset-0" />
              </div>
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
                        onClick={async () => {
                          if (tab === "GIFs" || tab === "Background") {
                            return await handleAddGif(
                              "http://localhost:1337" + trait.image[0].url
                            );
                          } else if (tab === "Stickers") {
                            return await handleAddStikcer(
                              "http://localhost:1337" + trait.image[0].url
                            );
                          }
                        }}
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
          <button
            onClick={handleDownload}
            className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2"
          >
            DOWNLOAD
          </button>
          <button
            onClick={handleMorph}
            className="focus:outline-none text-white border-2 border-transparent bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2"
          >
            MORPH
          </button>
        </div>
      </main>
    </div>
  );
}
