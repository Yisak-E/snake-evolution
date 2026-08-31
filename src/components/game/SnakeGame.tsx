"use client";

import { useEffect, useState } from "react";

import GameCanvas from "./GameCanvas";
import GameHUD from "./GameHUD";

import {
  createSnake,
  getNextHead,
  moveSnake
} from "@/lib/game/gameEngine";

import {
  isSelfCollision,
  isWallCollision
} from "@/lib/game/collision";

import {
  createFood,
  isFoodCollision
} from "@/lib/game/food";

import { GameState, Direction } from "@/types/game";

export default function SnakeGame() {
  const [gameState, setGameState] =
    useState<GameState>(() => {
      const snake = createSnake();

      return {
        snake,
        food: createFood(snake),
        gameOver: false
      };
    });

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      let direction: Direction | null = null;

      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          direction = "UP";
          break;

        case "ArrowDown":
        case "s":
        case "S":
          direction = "DOWN";
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          direction = "LEFT";
          break;

        case "ArrowRight":
        case "d":
        case "D":
          direction = "RIGHT";
          break;
      }

      if (!direction) return;

      setGameState(prev => ({
        ...prev,
        snake: {
          ...prev.snake,
          nextDirection: direction!
        }
      }));
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  useEffect(() => {
    if (gameState.gameOver) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const nextHead =
          getNextHead(prev.snake);

        if (
          isWallCollision(nextHead)
        ) {
          return {
            ...prev,
            gameOver: true
          };
        }

        const eating =
          isFoodCollision(
            nextHead,
            prev.food
          );

        const newSnake =
          moveSnake(
            prev.snake,
            eating
          );

        if (
          isSelfCollision(newSnake)
        ) {
          return {
            ...prev,
            gameOver: true
          };
        }

        return {
          snake: newSnake,
          food: eating
            ? createFood(newSnake)
            : prev.food,
          gameOver: false
        };
      });
    }, 120);

    return () =>
      clearInterval(interval);
  }, [gameState.gameOver]);

  function restart() {
    const snake = createSnake();

    setGameState({
      snake,
      food: createFood(snake),
      gameOver: false
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-950 px-4 py-10">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Snake Evolution
      </h1>

      <GameHUD
        score={gameState.snake.score}
      />

      <GameCanvas
        gameState={gameState}
      />

      {gameState.gameOver && (
        <div className="mt-6 text-center">
          <div className="mb-4 text-3xl font-bold text-red-500">
            GAME OVER
          </div>

          <button
            onClick={restart}
            className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-500"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {!gameState.gameOver && (
        <p className="mt-6 text-gray-400">
          Use Arrow Keys or WASD to move
        </p>
      )}
    </div>
  );
}