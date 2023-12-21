import React, { useState, useEffect } from 'react';
import './GameContainer.css';

const GameContainer = () => {
  const [applePosition, setApplePosition] = useState({ x: 0, y: 0 });
  const [snakeDirection, setSnakeDirection] = useState('RIGHT');
  const [snakeSegments, setSnakeSegments] = useState([{ x: 0, y: 0 }]);
  const [gameLoop, setGameLoop] = useState(null);

  useEffect(() => {
    generateApplePosition();
  }, []);

  const generateApplePosition = () => {
    const newApplePosition = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20,
    };
    setApplePosition(newApplePosition);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          setSnakeDirection('UP');
          break;
        case 's':
          setSnakeDirection('DOWN');
          break;
        case 'a':
          setSnakeDirection('LEFT');
          break;
        case 'd':
          setSnakeDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      let newSegments = [...snakeSegments];
      let newHead = { ...newSegments[0] };

      switch (snakeDirection) {
        case 'UP':
          newHead.y -= 5;
          break;
        case 'DOWN':
          newHead.y += 5;
          break;
        case 'LEFT':
          newHead.x -= 5;
          break;
        case 'RIGHT':
          newHead.x += 5;
          break;
        default:
          break;
      }

      // Get the width and height of the game containers
      const containerWidth = document.querySelector('.game-container')
        .clientWidth;
      const containerHeight = document.querySelector('.game-container')
        .clientHeight;



      // Wrap around the screen if the snake crosses the boundary
      newHead.x = (newHead.x + containerWidth) % containerWidth;
      newHead.y = (newHead.y + containerHeight) % containerHeight;

      newSegments.unshift(newHead);

      if (
        Math.abs(newHead.x - applePosition.x) < 25 &&
        Math.abs(newHead.y - applePosition.y) < 25
      ) {
        generateApplePosition();
        newSegments = [...newSegments, { x: -1, y: -1 }];
      }
      if (newSegments.length > snakeSegments.length) {
        newSegments.pop();
      }

      setSnakeSegments(newSegments);
    };

    const intervalId = setInterval(moveSnake, 25);

    return () => {
      clearInterval(intervalId);
    };
  }, [snakeDirection, snakeSegments, applePosition]);

  return (
    <div className="game-container">
      {snakeSegments.map((segment, index) => (
        <div
          key={index}
          className={`snake-segment ${index === 0 ? 'head' : ''} ${index > 0 ? 'tail' : ''
            }`}
          style={{
            left: `${segment.x < 0 ? segment.x + containerWidth : segment.x}px`,
            top: `${segment.y < 0 ? segment.y + containerHeight : segment.y}px`,
          }}
        ></div>
      ))}

      <div
        className="apple"
        style={{ left: `${applePosition.x}px`, top: `${applePosition.y}px` }}
      ></div>
    </div>
  );
};

export default GameContainer;
