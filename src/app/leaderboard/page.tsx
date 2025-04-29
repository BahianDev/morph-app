
const leaderboard = [
  { rank: "01", name: "MORPHY", address: "0x90sj.....", score: 420000 },
  { rank: "02", name: "CZ", address: "0x90sj.....", score: 69000 },
  { rank: "03", name: "VITALIK", address: "0x90sj.....", score: 69000 },
  { rank: "04", name: "SATOSHI", address: "0x90sj.....", score: 69000 },
  { rank: "05", name: "MORPHY", address: "0x90sj.....", score: 69000 },
  { rank: "07", name: "CZ", address: "0x90sj.....", score: 69000 },
  { rank: "08", name: "VITALIK", address: "0x90sj.....", score: 69000 },
  { rank: "09", name: "SATOSHI", address: "0x90sj.....", score: 69000 },
  { rank: "10", name: "VITALIK", address: "0x90sj.....", score: 69000 },
  { rank: "11", name: "SATOSHI", address: "0x90sj.....", score: 69000 },
];

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen text-black p-4 sm:p-8">
      <main className="flex flex-col items-center">
        <div className="bg-custom-gray rounded-xl p-4 sm:p-6 w-full max-w-6xl">
          <h2 className="text-2xl sm:text-4xl font-black text-center">
            <span className="text-green-600">MORPH&apos;D</span>{" "}
            <span className="text-white">LEADERBOARD</span>
          </h2>

          <div className="mt-6 space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-4 rounded-md ${
                  index === 0 ? "bg-primary text-white" : "bg-tamber-gray"
                }`}
              >
                <div className="flex gap-4 sm:gap-5 items-center">
                  <span className="font-bold text-xl sm:text-3xl text-white">
                    {entry.rank}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-bold uppercase">
                      {entry.name}
                    </span>
                    <span className="text-xs sm:text-base">{entry.address}</span>
                  </div>
                </div>
                <span className="text-xl sm:text-3xl font-thin text-white">
                  {entry.score.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
