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
        width={94}
        height={94}
        className="rounded-lg"
      />
    </div>
  );
};

export default ImageThumbnail;
