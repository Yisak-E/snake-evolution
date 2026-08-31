"use client";

interface Props {
  score: number;
}

export default function GameHUD({ score }: Props) {
  return (
    <div className="mb-4 flex w-full max-w-[600px] justify-between text-white">
      <div>
        <span className="text-gray-400">
          SCORE
        </span>

        <div className="text-2xl font-bold">
          {score}
        </div>
      </div>

      <div className="text-right">
        <span className="text-gray-400">
          MODE
        </span>

        <div className="text-2xl font-bold">
          CLASSIC
        </div>
      </div>
    </div>
  );
}