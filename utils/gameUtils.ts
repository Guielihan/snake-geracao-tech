import { Coordinate } from "../types";

export const GRID_SIZE = 20;

export const getRandomCoordinate = (snake: Coordinate[]): Coordinate => {
  let newFood: Coordinate;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    // Ensure food doesn't spawn on snake
    const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
};

export const checkCollision = (head: Coordinate, snake: Coordinate[]): boolean => {
  // Wall Collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true;
  }
  
  // Self Collision (start loop from 1 to ignore head vs head)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  
  return false;
};
