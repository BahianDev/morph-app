import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <main className="flex flex-col gap-8  items-center justify-center">
        <div className="flex space-x-5 flex-col lg:flex-row">
            <Link href="/morphys" className="flex flex-col items-center">
                <div className="bg-custom-gray hover:bg-primary transition-all duration-1000 p-4 rounded-xl cursor-pointer">
                    <Image src="/home/morphy.png" width={500} height={500} alt="MORPH"/>
                </div>
                <span className="font-bold text-3xl">MORPH A MORPHY</span>
            </Link>
            <Link href="/memes" className="flex flex-col items-center">
                <div className="bg-custom-gray hover:bg-primary transition-all duration-1000 p-4 rounded-xl cursor-pointer">
                    <Image src="/home/memes.png" width={500} height={500} alt="MORPH"/>
                </div>
                <span className="font-bold text-3xl">MORPH A MEME</span>
            </Link>
        </div>

      </main>
    </div>
  );
}
