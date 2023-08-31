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
      switch (event.key) {
        case 'ArrowUp':
          setSnakeDirection('UP');
          break;
        case 'ArrowDown':
          setSnakeDirection('DOWN');
          break;
        case 'ArrowLeft':
          setSnakeDirection('LEFT');
          break;
        case 'ArrowRight':
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
          newHead.y -= 20;
          break;
        case 'DOWN':
          newHead.y += 20;
          break;
        case 'LEFT':
          newHead.x -= 20;
          break;
        case 'RIGHT':
          newHead.x += 20;
          break;
        default:
          break;
      }

      // Get the width and height of the game container
      const containerWidth = 400; // Adjust this based on your container width
      const containerHeight = 400; // Adjust this based on your container height

      // Wrap around the screen if the snake crosses the boundary
      newHead.x = (newHead.x + containerWidth) % containerWidth;
      newHead.y = (newHead.y + containerHeight) % containerHeight;

      newSegments.unshift(newHead);

      if (newHead.x === applePosition.x && newHead.y === applePosition.y) {
        generateApplePosition();
        newSegments = [...newSegments, { x: -1, y: -1 }];
      }

      if (newSegments.length > snakeSegments.length) {
        newSegments.pop();
      }

      setSnakeSegments(newSegments);
    };

    const intervalId = setInterval(moveSnake, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [snakeDirection, snakeSegments, applePosition]);

  return (
    <div className="game-container">
      {snakeSegments.map((segment, index) => (
        <div
          key={index}
          className={`snake-segment ${index === 0 ? 'head' : ''} ${
            index > 0 ? 'tail' : ''
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
