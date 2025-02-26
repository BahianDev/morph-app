import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center justify-center">
        <div className="flex space-x-5 flex-col lg:flex-row">
          <Link href="/home" className="flex flex-col items-center w-full">
            <div className="relative bg-custom-gray hover:bg-primary transition-all duration-1000 p-4 rounded-xl cursor-pointer">
              <img src="/home/morphy.png" alt="MORPH" />
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center rounded-xl">
                <span className="text-white font-bold text-2xl">Coming Soon</span>
              </div>
            </div>
            <span className="font-bold text-3xl">MORPH A MORPHY</span>
          </Link>
          <Link href="/memes" className="flex flex-col items-center w-full">
            <div className="bg-custom-gray hover:bg-primary transition-all duration-1000 p-4 rounded-xl cursor-pointer">
              <img  src="/home/memes.png" alt="MORPH" />
            </div>
            <span className="font-bold text-3xl">MORPH A MEME</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
