interface ImageThumbnailProps {
  src: string;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ src }) => {
  return (
    <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
      <img
        src={src}
        alt="base"
        className="rounded-lg max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default ImageThumbnail;
