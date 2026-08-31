export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Position {
  x: number;
  y: number;
};

export interface Snake {
    body: Position[];
    direction: Direction;
    nextDirection: Direction;
    score: number;
    alive: boolean;
}

export interface Food {
    position: Position;
}

export interface GameState {
    snake: Snake;
    food: Food;
    gridSize: number;
    gameOver: boolean;
}