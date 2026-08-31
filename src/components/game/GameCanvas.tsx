"use client";

import { useEffect, useRef } from "react";
import { GameState } from "@/types/game";
import { GRID_SIZE } from "@/lib/game/gameEngine";

interface Props {
  gameState: GameState;
}

export default function GameCanvas({ gameState }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Background
    ctx.fillStyle = "#111827";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Grid
    ctx.strokeStyle = "#1f2937";

    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(
        i * size,
        canvas.height
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(
        canvas.width,
        i * size
      );
      ctx.stroke();
    }

    // Snake
    gameState.snake.body.forEach(
      (segment, index) => {
        ctx.fillStyle =
          index === 0
            ? "#22c55e"
            : "#16a34a";

        ctx.fillRect(
          segment.x * size + 1,
          segment.y * size + 1,
          size - 2,
          size - 2
        );
      }
    );

    // Food
    ctx.fillStyle = "#ef4444";

    ctx.beginPath();

    ctx.arc(
      gameState.food.position.x * size +
        size / 2,
      gameState.food.position.y * size +
        size / 2,
      size * 0.35,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="w-full max-w-[600px] rounded-lg border border-gray-700"
    />
  );
}