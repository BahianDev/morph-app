declare module "gifler" {
    interface Animation {
      animateInCanvas(canvas: HTMLCanvasElement): void;
      stop(): void;
      onDrawFrame: (
        ctx: CanvasRenderingContext2D,
        frame: { buffer: HTMLCanvasElement; x: number; y: number }
      ) => void;
    }
  
    function gifler(src: string): { get(callback: (animation: Animation) => void): void };
  
    export default gifler;
  }
  