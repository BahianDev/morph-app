import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-10 row-start-2 items-center justify-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-7xl lg:text-9xl">
          READY TO <strong className="text-primary">MORPH</strong>?
        </h1>
        <div className="flex gap-3">
          <Image
            src="/landing/1.png"
            className="hidden lg:flex"
            width={300}
            height={400}
            alt="1"
            priority
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <Image
            src="/landing/2.png"
            className="hidden lg:flex"
            width={300}
            height={400}
            alt="2"
            priority
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <Image
            src="/landing/3.png"
            width={300}
            height={400}
            alt="3"
            priority
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <Image
            src="/landing/4.png"
            className="hidden lg:flex"
            width={300}
            height={400}
            alt="3"
            priority
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </div>
        <Link
          href="/home"
          className="focus:outline-none text-white bg-primary hover:bg-green-700 font-bold rounded-lg text-3xl px-10 py-2 me-2 mb-2"
        >
          LFG!
        </Link>
      </main>
    </div>
  );
}
