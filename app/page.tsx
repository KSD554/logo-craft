"use client";
import Image from "next/image";
import IconPicker from "./components/IconPicker";
import { useState } from "react";
import { Download, icons } from "lucide-react";
import ColorPicker from "./components/ColorPicker";
import React from "react";
import domtoimage from "dom-to-image";
import confetti from "canvas-confetti";

type IconName = keyof typeof icons;

export default function Home() {
  const [selectedIcon, setSelectedIcon] = useState<string>("Apple");
  const SelectedIconComponent = selectedIcon && icons[selectedIcon as IconName]
    ? icons[selectedIcon as IconName]
    : null;
  const [iconSize, setIconSize] = useState<number>(200);
  const [iconStrokeWidth, setIconStrokeWidth] = useState<number>(3);
  const [iconRotation, setIconRotation] = useState<number>(0);
  const [shadow, setShadow] = useState<string>("shadow-none");
  const [shadowNumber, setShadowNumber] = useState<number>(0);
  const [radius, setRadius] = useState<number>(12);
  const [activeTab, setActiveTab] = useState<"stroke" | "background" | "fill">("stroke");
  const [iconStrokeColor, setIconStrokeColor] = useState<string>("black");
  const [backgroundColor, setBackgroundColor] = useState<string>("linear-gradient(45deg, rgba(255, 111, 97, 1) 0%, rgba(255, 185, 120, 1) 100%)");
  const [fillColor, setFillColor] = useState<string>("yellow");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);

  const handleIconSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconSize(Number(e.target.value));
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconStrokeWidth(Number(e.target.value));
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconRotation(Number(e.target.value));
  };

  const handleShadowNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setShadowNumber(value);

    switch (value) {
      case 25:
        setShadow("shadow-sm");
        break;
      case 50:
        setShadow("shadow-md");
        break;
      case 75:
        setShadow("shadow-lg");
        break;
      case 100:
        setShadow("shadow-2xl");
        break;
      default:
        setShadow("shadow-none");
    }
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };

  const getBackgroundStyle = () => {
    return backgroundColor.startsWith("linear-gradient")
      ? { background: backgroundColor }
      : { backgroundColor: backgroundColor };
  };

  const getPresetBackgroundStyle = (color: string) => {
    return color.startsWith("linear-gradient")
      ? { background: color }
      : { backgroundColor: color };
  };

  const logoPresets = [
    // Your presets data
    {
      id: 1,
      backgroundColor: "linear-gradient(45deg, rgba(255, 126, 95, 1) 0%, rgba(254, 180, 123, 1) 100%)", // Warm Gradient
      radius: 8,
      fillColor: "blue",
      iconRotation: 0,
      iconStrokeColor: "white",
      iconStrokeWidth: 2,
      iconSize: 200,
      icon: "VenetianMask",
    },
    // More presets...
  ];

  const handlePresetSelect = (preset: typeof logoPresets[0]) => {
    setSelectedIcon(preset.icon);
    setIconSize(preset.iconSize);
    setIconStrokeColor(preset.iconStrokeColor);
    setIconStrokeWidth(preset.iconStrokeWidth);
    setIconRotation(preset.iconRotation);
    setBackgroundColor(preset.backgroundColor);
    setFillColor(preset.fillColor);
    setRadius(preset.radius * 8);
  };

  const handleDownloadImage = (format: "png" | "svg") => {
    setIsDownloading(true);
    setDownloadCompleted(false);
    const element = document.getElementById("iconContainer");

    if (element) {
      let imagePromise: Promise<string>;

      if (format === "svg") {
        imagePromise = domtoimage.toSvg(element, { bgcolor: undefined });
      } else {
        imagePromise = domtoimage.toPng(element, { bgcolor: undefined });
      }

      imagePromise
        .then((dataUrl: string) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `logo.${format}`;
          link.click();

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999,
          });

          setIsDownloading(false);
          setDownloadCompleted(true);
        })
        .catch((error: Error) => {
          console.error(error);
          setIsDownloading(false);
        });
    }
  };

  return (
    <div>
      <section className=" flex flex-col md:flex-row md:justify-between">
        <div className="md:w-1/4 p-5">
          <div className="flex items-center justify-center space-x-2 mb-4 w-full">
            <button
              className={`btn w-1/3 ${activeTab === "stroke" ? "btn-secondary" : ""}`}
              onClick={() => setActiveTab("stroke")}
            >
              Bordure
            </button>

            <button
              className={`btn w-1/3 ${activeTab === "background" ? "btn-secondary" : ""}`}
              onClick={() => setActiveTab("background")}
            >
              Arrière-plan
            </button>

            <button
              className={`btn w-1/3 ${activeTab === "fill" ? "btn-secondary" : ""}`}
              onClick={() => setActiveTab("fill")}
            >
              Remplissage
            </button>
          </div>

          <div>
            {activeTab === "stroke" && (
              <ColorPicker color={iconStrokeColor} allowGradient={false} onColorChange={setIconStrokeColor} />
            )}

            {activeTab === "background" && (
              <ColorPicker color={backgroundColor} allowGradient={true} onColorChange={setBackgroundColor} />
            )}

            {activeTab === "fill" && (
              <ColorPicker color={fillColor} allowGradient={false} onColorChange={setFillColor} />
            )}
          </div>
        </div>

        <div className="md:w-2/4 flex justify-center items-center h-screen bg-[url('/file.svg')] bg-cover bg-center border border-base-200 pt-4 relative">
          <div className="flex items-center justify-between absolute top-0 left-0 bg-base-100 z-50 w-full p-3">
            <div className="flex items-center font-bold italic text-2xl">
              <Image
                src="/logo.png"
                width={500}
                height={500}
                className="w-10 h-10"
                alt="logo"
              />
              <span className="text-secondary ml-2">e</span>Logo
            </div>
            <div className="flex items-center">
              <IconPicker onIconSelect={setSelectedIcon} selected={selectedIcon} />

              <button
                className="btn ml-5"
                onClick={() => {
                  const m = document.getElementById('my_modal_1') as HTMLDialogElement;
                  if (m) {
                    m.showModal();
                    setDownloadCompleted(false);
                  }
                }}
              >
                Télécharger <Download className="w-4" />
              </button>
            </div>
          </div>

          <div className="bg-neutral-content/10 hover:bg-neutral-content/20 aspect-square border-2 border-base-3000 hover:border-neutral/15 border-dashed p-5 md:p-20">
            <div
              id="iconContainer"
              className={`w-[450px] h-[450px] flex justify-center items-center ${shadow}`}
              style={{
                ...getBackgroundStyle(),
                borderRadius: `${radius}px`,
              }}
            >
              {SelectedIconComponent && (
                <SelectedIconComponent
                  size={iconSize}
                  style={{
                    strokeWidth: iconStrokeWidth,
                    fill: fillColor,
                    stroke: iconStrokeColor,
                    display: "block",
                    transform: `rotate(${iconRotation}deg)`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Download Options */}
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Téléchargez votre logo</h3>
          <p className="py-4">Sélectionnez le format de téléchargement:</p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => handleDownloadImage("png")}
            >
              PNG
            </button>
            <button
              className="btn"
              onClick={() => handleDownloadImage("svg")}
            >
              SVG
            </button>
            <button className="btn" onClick={() => setDownloadCompleted(true)}>
              Fermer
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
