export function renderIcon(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  iconSrc: string
) {
  const size = 20;
  const img = new Image();
  img.src = iconSrc;

  img.onload = () => {
    ctx.save();
    ctx.translate(left, top);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}
