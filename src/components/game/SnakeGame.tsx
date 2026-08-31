"use client";

import { useEffect, useState } from "react";

import GameCanvas from "./GameCanvas";
import GameHUD from "./GameHUD";

import {
  createSnake,
  getNextHead,
  moveSnake,
  isOpposite,
} from "@/lib/game/gameEngine";

import {
  isSelfCollision,
  isWallCollision,
} from "@/lib/game/collision";

import {
  createFood,
  isFoodCollision,
} from "@/lib/game/food";

import { GameState, Direction } from "@/types/game";

type GameSpeed = "SLOW" | "NORMAL" | "FAST";

const SPEEDS: Record<GameSpeed, number> = {
  SLOW: 180,
  NORMAL: 120,
  FAST: 70,
};

export default function SnakeGame() {
  const [speed, setSpeed] =
    useState<GameSpeed>("NORMAL");

  const [gameStarted, setGameStarted] =
    useState(false);

  const [paused, setPaused] =
    useState(false);

  const [highScore, setHighScore] =
    useState(0);

  const [gameState, setGameState] =
    useState<GameState>(() => {
      const snake = createSnake();

      return {
        snake,
        food: createFood(snake),
        gameOver: false,
      };
    });

  /*
   * Keyboard controls
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (!gameStarted) return;

      /*
       * Pause
       */
      if (event.key === " ") {
        event.preventDefault();

        if (!gameState.gameOver) {
          setPaused((value) => !value);
        }

        return;
      }

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

    setGameState((prev) => {

        if (
            isOpposite(
            prev.snake.direction,
            direction!
            )
        ) {
            return prev;
        }

        return {
            ...prev,
            snake: {
            ...prev.snake,
            nextDirection: direction!,
            },
        };
        });
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
  }, [
    gameStarted,
    gameState.gameOver,
  ]);

  /*
   * Main game loop
   */
  useEffect(() => {
    if (!gameStarted) return;

    if (paused) return;

    if (gameState.gameOver) return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        const nextHead =
          getNextHead(prev.snake);

        /*
         * Wall collision
         */
        if (
          isWallCollision(nextHead)
        ) {
          const finalScore =
            prev.snake.score;

          setHighScore((current) =>
            Math.max(
              current,
              finalScore
            )
          );

          return {
            ...prev,
            gameOver: true,
          };
        }

        /*
         * Food collision
         */
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

        /*
         * Self collision
         */
        if (
          isSelfCollision(newSnake)
        ) {
          const finalScore =
            newSnake.score;

          setHighScore((current) =>
            Math.max(
              current,
              finalScore
            )
          );

          return {
            ...prev,
            snake: newSnake,
            gameOver: true,
          };
        }

        return {
          snake: newSnake,

          food: eating
            ? createFood(newSnake)
            : prev.food,

          gameOver: false,
        };
      });
    }, SPEEDS[speed]);

    return () =>
      clearInterval(interval);
  }, [
    gameStarted,
    paused,
    gameState.gameOver,
    speed,
  ]);

  /*
   * Start game
   */
  function startGame() {
    const snake = createSnake();

    setGameState({
      snake,
      food: createFood(snake),
      gameOver: false,
    });

    setPaused(false);
    setGameStarted(true);
  }

  /*
   * Restart
   */
  function restartGame() {
    startGame();
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">

      {/* Header */}
      <div className="mx-auto max-w-[700px]">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Snake Evolution
            </h1>

            <p className="text-sm text-gray-400">
              Classic Mode
            </p>
          </div>

          <div className="text-right">

            <div className="text-xs text-gray-500">
              HIGH SCORE
            </div>

            <div className="text-xl font-bold">
              {highScore}
            </div>

          </div>

        </div>

        {/* Settings */}
        {!gameStarted && (
          <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="mb-4 text-lg font-semibold">
              Game Settings
            </h2>

            <div className="mb-5">

              <div className="mb-2 text-sm text-gray-400">
                Speed
              </div>

              <div className="flex gap-2">

                {(
                  Object.keys(
                    SPEEDS
                  ) as GameSpeed[]
                ).map((value) => (

                  <button
                    key={value}
                    onClick={() =>
                      setSpeed(value)
                    }
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      speed === value
                        ? "bg-green-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {value}
                  </button>

                ))}

              </div>

            </div>

            <button
              onClick={startGame}
              className="w-full rounded-lg bg-green-600 py-3 font-bold hover:bg-green-500"
            >
              START GAME
            </button>

          </div>
        )}

        {/* HUD */}
        {gameStarted && (
          <>
            <GameHUD
              score={gameState.snake.score}
            />

            {/* Game */}
            <div className="relative">

              <GameCanvas
                gameState={gameState}
              />

              {/* Pause overlay */}
              {paused &&
                !gameState.gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/70">

                    <div className="text-center">

                      <div className="mb-2 text-4xl font-bold">
                        PAUSED
                      </div>

                      <p className="text-gray-300">
                        Press SPACE to resume
                      </p>

                    </div>

                  </div>
                )}

            </div>

            {/* Controls */}
            <div className="mt-5 flex justify-center gap-3">

              {!gameState.gameOver && (
                <button
                  onClick={() =>
                    setPaused(
                      (value) => !value
                    )
                  }
                  className="rounded-lg bg-gray-800 px-5 py-2 hover:bg-gray-700"
                >
                  {paused
                    ? "RESUME"
                    : "PAUSE"}
                </button>
              )}

              <button
                onClick={restartGame}
                className="rounded-lg bg-green-600 px-5 py-2 font-semibold hover:bg-green-500"
              >
                RESTART
              </button>

            </div>

            {/* Game over */}
            {gameState.gameOver && (
              <div className="mt-8 rounded-xl border border-red-900 bg-red-950/30 p-6 text-center">

                <div className="text-3xl font-bold text-red-400">
                  GAME OVER
                </div>

                <div className="mt-2 text-gray-300">
                  Final Score
                </div>

                <div className="mt-1 text-4xl font-bold">
                  {gameState.snake.score}
                </div>

                <button
                  onClick={restartGame}
                  className="mt-6 rounded-lg bg-green-600 px-8 py-3 font-bold hover:bg-green-500"
                >
                  PLAY AGAIN
                </button>

              </div>
            )}

            {/* Help */}
            {!gameState.gameOver && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Arrow Keys / WASD to move
                <span className="mx-2">•</span>
                SPACE to pause
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}