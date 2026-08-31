import { Direction, Position, Snake } from "@/types/game";

export const GRID_SIZE = 25;

export function createSnake(): Snake {
  return {
    body: [
      { x: 12, y: 12 },
      { x: 11, y: 12 },
      { x: 10, y: 12 }
    ],
    direction: "RIGHT",
    nextDirection: "RIGHT",
    score: 0,
    alive: true
  };
}

export function getNextHead(
  snake: Snake
): Position {
  const head = snake.body[0];

  switch (snake.nextDirection) {
    case "UP":
      return { x: head.x, y: head.y - 1 };

    case "DOWN":
      return { x: head.x, y: head.y + 1 };

    case "LEFT":
      return { x: head.x - 1, y: head.y };

    case "RIGHT":
      return { x: head.x + 1, y: head.y };
  }
}

export function moveSnake(
  snake: Snake,
  grow: boolean
): Snake {
  const newHead = getNextHead(snake);

  const newBody = [newHead, ...snake.body];

  if (!grow) {
    newBody.pop();
  }

  return {
    ...snake,
    body: newBody,
    direction: snake.nextDirection,
    score: grow ? snake.score + 10 : snake.score
  };
}

export function isOpposite(
  current: Direction,
  next: Direction
): boolean {
  return (
    (current === "UP" && next === "DOWN") ||
    (current === "DOWN" && next === "UP") ||
    (current === "LEFT" && next === "RIGHT") ||
    (current === "RIGHT" && next === "LEFT")
  );
}