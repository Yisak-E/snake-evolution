import { GRID_SIZE } from "./gameEngine";
import { Position, Snake } from "@/types/game";

export function isWallCollision(
  position: Position
): boolean {
  return (
    position.x < 0 ||
    position.x >= GRID_SIZE ||
    position.y < 0 ||
    position.y >= GRID_SIZE
  );
}

export function isSelfCollision(
  snake: Snake
): boolean {
  const [head, ...body] = snake.body;

  return body.some(
    segment =>
      segment.x === head.x &&
      segment.y === head.y
  );
}