import Drag from "@/util/Drag";
import TRIGGER from "@/config/trigger";

interface ImageThumbnailProps {
  src: string
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ src }) => {
  return (
    <div className="w-24 h-24 ">
      <Drag
        dragType="copyMove"
        dragSrc={{
          trigger: TRIGGER.INSERT.IMAGE,
          "data-item-type": 'image',
          src,
        }}
      >
        <img alt={'base'} src={src} />
      </Drag>
    </div>
  );
};

export default ImageThumbnail;
