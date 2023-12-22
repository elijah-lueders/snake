import React, { useState, useEffect } from 'react';
import './GameContainer.css';

const GameContainer = () => {
  const [applePosition, setApplePosition] = useState({ x: 40, y: 40 });
  const [snakeDirection, setSnakeDirection] = useState('');
  const [snakeSegments, setSnakeSegments] = useState([{ x: 0 , y: 0 }]);
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
          setSnakeDirection('N');
          break;
        case 'e':
          setSnakeDirection('NE');
          break;
        case 'd':
          setSnakeDirection('E');
          break;
        case 'c':
          setSnakeDirection('SE');
          break;
        case 'x':
          setSnakeDirection('S');
          break;
        case 's':
          setSnakeDirection('S');
          break;
        case 'z':
          setSnakeDirection('SW');
          break;
        case 'a':
          setSnakeDirection('W');
          break;
        case 'q':
          setSnakeDirection('NW');
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
        case 'N':
          newHead.y -= 5;
          break;
        case 'NE':
          newHead.x += 3;
          newHead.y -= 3;
          break;
        case 'E':
          newHead.x += 5;
          break;
        case 'SE':
          newHead.x += 3;
          newHead.y += 3;
          break;
        case 'S':
          newHead.y += 5;
          break;
        case 'SW':
          newHead.x -= 3;
          newHead.y += 3;
          break;
        case 'W':
          newHead.x -= 5;
          break;
        case 'NW':
          newHead.x -= 3;
          newHead.y -= 3;
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

    const intervalId = setInterval(moveSnake, 40);

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
