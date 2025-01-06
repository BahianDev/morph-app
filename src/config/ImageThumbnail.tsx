import Image from "next/image";

interface ImageThumbnailProps {
  src: string;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ src }) => {
  return (
    <div className="w-24 h-24 ">
      <Image
        alt={"base"}
        src={src}
        width={80}
        height={80}
      />
    </div>
  );
};

export default ImageThumbnail;
