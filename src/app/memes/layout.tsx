
export default async function MemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <section className="py-9 px-20">
        <header className="flex justify-between">
          <h1 className="font-extrabold text-4xl">MORPH’D</h1>
          <button className="focus:outline-none text-white bg-primary hover:bg-green-700 font-bold rounded-lg text-lg px-5 py-2 me-2 mb-2">
            CONNECT
          </button>
        </header>
        {children}
      </section>
  );
}
