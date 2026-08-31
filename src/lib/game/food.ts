import { GRID_SIZE } from "./gameEngine";
import { Food, Position, Snake } from "@/types/game";

export function createFood(snake: Snake): Food {
  let position: Position;

  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (
    snake.body.some(
      segment =>
        segment.x === position.x &&
        segment.y === position.y
    )
  );

  return { position };
}

export function isFoodCollision(
  head: Position,
  food: Food
): boolean {
  return (
    head.x === food.position.x &&
    head.y === food.position.y
  );
}