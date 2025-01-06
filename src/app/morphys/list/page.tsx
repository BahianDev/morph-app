import Card from "@/components/morphys/Card";

export default function MorphysList() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-20">
      <div className="flex flex-col items-center justify-center gap-6 bg-[rgb(217,217,217)] p-5 rounded-lg">
        <h1 className="text-7xl text-white font-bold">
          <strong className="text-primary">MORPH’D</strong> MORPHYS
        </h1>
        <div className="flex flex-wrap w-full items-center justify-center gap-6 ">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}
