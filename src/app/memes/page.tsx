"use client";

import ImageThumbnail from "@/config/ImageThumbnail";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Canvas, FabricImage, Group, Textbox } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import SuperGif from "libgif";
import { loadedImg } from "@/config/loadedImg";
import { canvasToFile } from "@/util/canvasToFile";
import { createGIF } from "@/util/createGIF";
import { base64ToBlob } from "@/util/base64ToBlob";
import abi from "@/contracts/Memes.abi.json";
import axios from "axios";
import { TbArrowForwardUp, TbArrowBack } from "react-icons/tb";
import { useHotkeys } from "react-hotkeys-hook";
import { IoMdColorPalette, IoMdCloudUpload } from "react-icons/io";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "../wagmi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import toast from "react-hot-toast";
import {
  Anton,
  Bebas_Neue,
  Lobster,
  Poppins,
  Raleway,
  Rubik,
  Monoton,
  Pacifico,
  Oswald,
} from "next/font/google";
import { NextFont } from "next/dist/compiled/@next/font";
import { MEME_CONTRACT_ADDRESS } from "@/constants";

const anton = Anton({ subsets: ["latin"], weight: ["400"] });
const bebas_Neue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });
const raleway = Raleway({ subsets: ["latin"], weight: ["400"] });
const rubik = Rubik({ subsets: ["latin"], weight: ["400"] });
const monoton = Monoton({ subsets: ["latin"], weight: ["400"] });
const pacifico = Pacifico({ subsets: ["latin"], weight: ["400"] });
const oswald = Oswald({ subsets: ["latin"], weight: ["400"] });

const fonts = [
  anton,
  bebas_Neue,
  lobster,
  poppins,
  raleway,
  rubik,
  monoton,
  pacifico,
  oswald,
];

export default function Memes() {
  const containerRef: any = useRef(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const backgroundUploadInputRef = useRef<HTMLInputElement>(null); // nova referência para upload

  const canvasRef = useRef<any>(null);
  const sections = ["Background", "Stickers", "GIFs", "Text"];

  const [textColor, setTextColor] = useState("#000000");

  const [canvas, setCanvas] = useState<any>(null);
  const [gifInterval, setGifInverval] = useState<number>(41);
  const [gifGroups, setGifGroups] = useState<any[]>([]);

  const [tab, setTab] = useState("Background");

  const imgOptions: any = {
    selectable: false,
    visible: false,
    originX: "left",
    originY: "top",
  };

  const handleDeleteActiveObject = useCallback(() => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if (activeObject instanceof Textbox && activeObject.isEditing) {
      return;
    }

    setGifGroups((prevGroups) =>
      prevGroups.filter((group) => group !== activeObject)
    );

    canvas.remove(activeObject);
    canvas.renderAll();
  }, [canvas]);

  useHotkeys(
    "backspace",
    (e) => {
      e.preventDefault();
      handleDeleteActiveObject();
    },
    { enabled: true },
    [canvas]
  );

  useHotkeys(
    "clear",
    (e) => {
      e.preventDefault();
      handleDeleteActiveObject();
    },
    { enabled: true },
    [canvas]
  );

  useHotkeys(
    "del",
    (e) => {
      e.preventDefault();
      handleDeleteActiveObject();
    },
    { enabled: true },
    [canvas]
  );

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const initCanvas = new Canvas(canvasRef.current, {
        width: containerWidth,
        height: containerHeight,
        selectionBorderColor: "#14A800",
        selectionColor: "#14A800",
        preserveObjectStacking: true,
      });

      initCanvas.backgroundColor = "transparent";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      // Observador para detectar mudanças no tamanho do contêiner
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          initCanvas.setWidth(width);
          initCanvas.setHeight(height);
          initCanvas.renderAll();
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        initCanvas.dispose();
        resizeObserver.disconnect();
      };
    }
  }, []);

  const handleAddGif = async (url: string) => {
    const imgEl = document.createElement("img");
    imgEl.setAttribute("rel:animated_src", url);
    imgEl.setAttribute("rel:auto_play", "0");

    // Cria um contêiner oculto para o elemento da imagem
    const div = document.createElement("div");
    div.style.display = "none";
    div.appendChild(imgEl);
    document.body.appendChild(div);

    const gif = new SuperGif({ gif: imgEl });
    const images: string[] = [];

    // Carrega a imagem para obter as dimensões
    const image = new Image();
    image.src = url;
    image.crossOrigin = "anonymous";
    await loadedImg(image);
    const { width } = image;
    const scale = 500 / width;
    Object.assign(imgOptions, { scaleX: scale, scaleY: scale });

    gif.load(async () => {
      // Remove o contêiner oculto após o carregamento
      div.remove();

      const interval = gif.get_duration_ms() / gif.get_length();
      setGifInverval(interval);

      // Extrai cada frame do GIF
      for (let i = 1; i <= gif.get_length(); i++) {
        gif.move_to(i);
        const file = canvasToFile(gif.get_canvas(), `gif-${i}`);
        images.push(URL.createObjectURL(file));
      }

      const gifFrames: any[] = [];
      // Cria um objeto do Fabric para cada frame
      for (let j = 0; j < images.length; j++) {
        const imgElement = new Image();
        imgElement.src = images[j];
        imgElement.crossOrigin = "anonymous";
        const img = new FabricImage(imgElement, { ...imgOptions });
        const loadImageOptions = { crossOrigin: "anonymous", ...imgOptions };
        await img.setSrc(images[j], loadImageOptions);
        gifFrames.push(img);
      }
      images.splice(0);

      // Agrupa os frames para que possam ser movidos e redimensionados juntos
      const group = new Group(gifFrames, {
        left: 20,
        top: 20,
        selectable: true,
        borderColor: "#14A800",
        cornerColor: "#14A800",
        borderScaleFactor: 2,
        objectCaching: false,
      });
      canvas.add(group);
      canvas.setActiveObject(group);
      setGifGroups((prev) => [...prev, group]);

      // Animação: alterna a visibilidade dos frames dentro do grupo
      let currentFrame = 0;
      setInterval(() => {
        group.getObjects().forEach((obj, index) => {
          obj.set("visible", index === currentFrame);
        });
        currentFrame = (currentFrame + 1) % group.getObjects().length;
        group.dirty = true;
        canvas.renderAll();
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
      oImg.borderColor = "#FFFFFF";
      oImg.borderScaleFactor = 2;
      oImg.cornerColor = "#FFFFFF";
      oImg.objectCaching = false;
      canvas.add(oImg);
      canvas.setActiveObject(oImg);
    });
  };

  const handleAddBackground = async (url: string) => {
    FabricImage.fromURL(url, {
      crossOrigin: "anonymous",
    }).then((img) => {
      const oImg = img;
      oImg.set({ left: 20, top: 20 });
      oImg.scale(0.1);
      oImg.borderColor = "#14A800";
      oImg.borderScaleFactor = 2;
      oImg.cornerColor = "#14A800";
      oImg.objectCaching = false;
      canvas.add(oImg);
      canvas.sendObjectToBack(oImg); // garante que o background fique atrás dos demais elementos
      canvas.setActiveObject(oImg);
    });
  };

  // Função para tratar o upload do background via input de arquivo
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileURL = URL.createObjectURL(file);
    handleAddBackground(fileURL);
  };

  const handleDownload = useCallback(async () => {
    if (gifGroups.length === 0) {
      const dataURL = canvas.toDataURL({ format: "png", multiplier: 8 });
      const blob = base64ToBlob(dataURL);
      const el = document.createElement("a");
      el.href = URL.createObjectURL(blob);
      el.download = "generated.png";
      el.style.display = "none";
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
      return;
    }
    // Para exportar como GIF, neste exemplo usamos o primeiro grupo de GIF
    const group = gifGroups[0];
    const frames = group.getObjects();
    let i = 0;
    const dataImages: Array<any> = [];
    let imageGenerated: any;

    const processFrames = async (): Promise<void> => {
      return new Promise((resolve) => {
        const processFrame = async () => {
          if (i >= frames.length) {
            try {
              const gif = await createGIF(dataImages, {
                gifWidth: 1080,
                gifHeight: 1080,
                interval: gifInterval / 1000,
                sampleInterval: 10,
                progressCallback: (progress: number) => {
                  console.log(progress);
                },
              });
              imageGenerated = gif;
              dataImages.length = 0;
            } catch (e) {
              console.error("Erro ao criar o GIF:", e);
            }
            resolve();
            return;
          }

          frames.forEach((frame: any, index: any) => {
            frame.set("visible", index === i);
          });

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
    el.download = "generated.gif";
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }, [gifGroups, canvas, gifInterval]);

  const handleMorph = useCallback(async () => {
    let imageGenerated: any;

    if (gifGroups.length === 0) {
      const dataURL = canvas.toDataURL({ format: "png" });
      imageGenerated = dataURL;
    } else {
      const group = gifGroups[0];
      const frames = group.getObjects();
      let i = 0;
      const dataImages: Array<any> = [];

      const processFrames = async (): Promise<void> => {
        return new Promise((resolve) => {
          const processFrame = async () => {
            if (i >= frames.length) {
              try {
                const gif = await createGIF(dataImages, {
                  gifWidth: 1080,
                  gifHeight: 1080,
                  interval: gifInterval / 1000,
                  sampleInterval: 10,
                  progressCallback: (progress: number) => {
                    console.log(progress);
                  },
                });
                imageGenerated = gif;
                dataImages.length = 0;
              } catch (e) {
                console.error("Erro ao criar o GIF:", e);
              }
              resolve();
              return;
            }

            frames.forEach((frame: any, index: any) => {
              frame.set("visible", index === i);
            });

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
    }

    try {
      toast.loading("Uploading metadata...");

      const tokenId = await readContract(config, {
        abi,
        address: MEME_CONTRACT_ADDRESS,
        functionName: "totalSupply",
      }).then((r) => Number(r) + 1);

      const formData = new FormData();
      formData.set("file", base64ToBlob(imageGenerated));
      formData.set("tokenId", String(tokenId));

      await axios.post("/memes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.dismiss();

      toast.loading("Sending transaction...");

      const result = await writeContract(config, {
        abi,
        address: MEME_CONTRACT_ADDRESS,
        functionName: "safeMint",
        args: [
          `https://morphd.s3.us-east-2.amazonaws.com/memes/metadata/${tokenId}.json`,
        ],
      });

      toast.dismiss();

      toast.loading("Confirming transaction...");

      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: result,
      });

      toast.dismiss();

      toast.custom(
        <div className="flex items-center gap-2 bg-white border-2 border-primary p-3 rounded-lg">
          <IoMdCheckmarkCircle size={10} className="w-10 h-10 text-primary" />

          <a
            className="font-bold text-lg"
            target="_blank"
            href={`https://explorer-holesky.morphl2.io/token/${MEME_CONTRACT_ADDRESS}/instance/${tokenId}`}
          >
            Click to see Morph Explorer
          </a>
        </div>,
        {
          duration: 4000,
        }
      );

      return transactionReceipt;
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
  }, [gifGroups, canvas, gifInterval]);

  const handleClear = useCallback(() => {
    canvas?.getObjects().forEach((obj: any) => {
      if (obj.type === "textbox") clearInterval(obj?.animateInterval);
    });

    canvas?.clear();
    setGifGroups([]);
  }, [canvas]);

  const handleAddText = useCallback(
    (font: NextFont) => {
      const text = new Textbox("Insert Here", {
        fontFamily: font.style.fontFamily,
        fill: textColor,
      });
      canvas.add(text);
    },
    [canvas, textColor]
  );

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTextColor(newColor);
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fill", newColor);
      canvas.renderAll();
    }
  };

  const handleIconClick = () => {
    colorInputRef.current?.click();
  };

  const fetchProjects = async ({ pageParam }: { pageParam?: number }) => {
    const res = await fetch(
      `https://better-festival-3bb25677f9.strapiapp.com/api/memes?populate=*&pagination[page]=${pageParam}&pagination[pageSize]=100`
    );
    if (!res.ok) {
      throw new Error("Erro ao buscar os memes");
    }
    const json = await res.json();

    return {
      data: json.data,
      pagination: json.meta.pagination,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["memes"],
      queryFn: fetchProjects,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, pageCount } = lastPage.pagination;
        return page < pageCount ? page + 1 : undefined;
      },
    });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleBringToFront = useCallback(() => {
    const activeObject = canvas?.getActiveObject();

    if (activeObject) {
      canvas.bringObjectForward(activeObject, true);
      canvas.renderAll();
    }
  }, [canvas]);

  const handleBringToBackward = useCallback(() => {
    const activeObject = canvas?.getActiveObject();

    if (activeObject) {
      canvas.sendObjectToBack(activeObject, true);
      canvas.renderAll();
    }
  }, [canvas]);

  const allMemes = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen py-8 px-4">
      <main className="flex flex-col gap-8 items-start justify-start w-full">
        <span className="font-medium text-2xl self-start">
          Morph your Morphy, download or mint on-chain to rep on socials. Simple!
        </span>
        <div className="flex space-x-5 flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:flex-row w-full gap-5">
            {/* Contêiner responsivo com ref para detectar alterações de tamanho */}
            <div
              ref={containerRef}
              className="bg-custom-gray rounded-xl relative w-full h-96 lg:w-[500px] lg:h-[500px]"
            >
              <div className="canvas_w relative">
                <canvas ref={canvasRef} className="absolute inset-0 flex-1" />
              </div>
              {/* Botões de bring to front/back */}
              <div className="bg-primary flex flex-col items-center justify-center gap-2 absolute w-12 h-28 z-50 right-2 top-2 rounded-lg ">
                <button className="bg-custom-gray w-10 h-10 rotate-90 rounded-lg">
                  <TbArrowForwardUp
                    onClick={handleBringToBackward}
                    className="text-4xl text-black"
                  />
                </button>
                <button
                  onClick={handleBringToFront}
                  className="bg-custom-gray w-10 h-10 rotate-90 rounded-lg"
                >
                  <TbArrowBack className="text-4xl text-black" />
                </button>
              </div>
            </div>
            <div className="bg-custom-gray rounded-xl h-full lg:flex-1 ">
              <div className="flex flex-wrap gap-8 items-center px-4 bg-tamber-gray py-4 md:py-0 md:h-16 w-full rounded-t-xl">
                {sections.map((section, key) => (
                  <div
                    onClick={() => setTab(section)}
                    key={key}
                    className={`${
                      tab === section
                        ? "text-white border-b-4 border-solid transition-all duration-300"
                        : "text-black"
                    } h-full flex items-center cursor-pointer`}
                  >
                    <span className="font-bold">{section}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 lg:ml-5">
                  <IoMdColorPalette
                    size={24}
                    color={textColor}
                    onClick={handleIconClick}
                    className="cursor-pointer"
                  />
                  {/* Hidden color input */}
                  <input
                    ref={colorInputRef}
                    id="color-picker"
                    type="color"
                    value={textColor}
                    onChange={handleTextColorChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <div className="px-4 py-8 flex gap-8 flex-wrap overflow-scroll max-h-[400px]">
                {tab === "Background" && (
                  <>
                    <div
                      onClick={() =>
                        backgroundUploadInputRef.current?.click()
                      }
                      className="border border-gray-500 w-24 h-24 rounded-lg cursor-pointer flex items-center justify-center"
                    >
                      <IoMdCloudUpload size={32} className="text-black" />
                    </div>
                    <input
                      type="file"
                      ref={backgroundUploadInputRef}
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      style={{ display: "none" }}
                    />
                  </>
                )}
                {allMemes &&
                  allMemes.length > 0 &&
                  allMemes
                    .filter((trait) => trait.type === tab)
                    .map((trait, key) => (
                      <div
                        key={key}
                        onClick={async () => {
                          if (tab === "GIFs") {
                            return await handleAddGif(trait.image.url);
                          } else if (tab === "Stickers") {
                            return await handleAddStikcer(trait.image.url);
                          } else if (tab === "Background") {
                            return await handleAddBackground(trait.image.url);
                          }
                        }}
                        className="border border-gray-500 w-24 h-24 rounded-lg cursor-pointer"
                      >
                        <ImageThumbnail src={`${trait.image.url}`} />
                      </div>
                    ))}
                {tab === "Text" &&
                  fonts.map((font, key) => (
                    <div
                      key={key}
                      onClick={() => handleAddText(font)}
                      className={`text-black text-8xl w-24 h-24 cursor-pointer ${font.className}`}
                    >
                      A
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:ml-5">
          <button
            onClick={handleClear}
            className="focus:outline-none text-black border-2 border-black bg-transparent font-bold rounded-lg text-lg px-8 py-1 me-2 mb-2"
          >
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
