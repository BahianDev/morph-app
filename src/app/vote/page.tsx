"use client"

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import toast from 'react-hot-toast';

const memes = [
  { id: 1, image: '/home/morphy.png' },
  { id: 2, image: '/mock1.jpg' },
  { id: 3, image: '/landing/2.png' },
];

export default function VotePage() {
  const [index, setIndex] = useState(0);

  const handleVote = (direction: string) => {
    toast.success(direction)
    console.log(`Voted ${direction} on meme id ${memes[index].id}`);
    setIndex((prev) => (prev + 1) % memes.length);
  };

  const currentMeme = memes[index];

  const handlers = useSwipeable({
    onSwipedLeft: () => handleVote('dislike'),
    onSwipedRight: () => handleVote('like'),
    trackMouse: true,
  });

  return (
    <div className="bg-gray-100 min-h-screen text-black sm:p-8">
      <main className="flex flex-col items-center">
        <div className="bg-custom-gray rounded-xl p-6 w-full max-w-3xl text-center">
          <h2 className="text-4xl font-black">
            <span className="text-green-600">MORPH&apos;D</span>{' '}
            <span className="text-white">MEMES</span>
          </h2>

          <div className="flex items-center justify-center relative mt-10">
            <button onClick={() => handleVote('left')} className="absolute left-0 text-white p-2">
              <ChevronLeft size={32} />
            </button>

            <div
              {...handlers}
              className="bg-sky-200 rounded-lg overflow-hidden w-80 h-80 flex items-center justify-center"
            >
              <img src={currentMeme.image} alt="Meme" className="object-contain h-full w-full" />
            </div>

            <button onClick={() => handleVote('right')} className="absolute right-0 text-white p-2">
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="flex gap-10 justify-center mt-6">
            <button
              onClick={() => handleVote('dislike')}
              className="bg-red-500 text-white p-3 rounded-full hover:scale-105"
            >
              <ThumbsDown size={24} />
            </button>
            <button
              onClick={() => handleVote('like')}
              className="bg-green-500 text-white p-3 rounded-full hover:scale-105"
            >
              <ThumbsUp size={24} />
            </button>
          </div>
        </div>

        <p className="italic text-sm mt-4 text-right w-full max-w-3xl pr-4">Swipe or vote below</p>
      </main>
    </div>
  );
}
