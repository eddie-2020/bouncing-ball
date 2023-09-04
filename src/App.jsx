import React, { useState, useEffect } from 'react';
import Ball from './components/Ball';
import Obstacle from './components/Obstacle';
import Score from './components/Score';
import './tailwind.css';
import './App.css'

function App() {
  const gameWidth = 800;
  const gameHeight = 600;
  const ballRadius = 20;
  const obstacleWidth = 80;
  const obstacleHeight = 20;
  const obstacleSpeed = 3;
  const initialBallPosition = { x: gameWidth / 2, y: gameHeight - 50 };
  const initialObstacles = [
    { x: 200, y: 0 },
    { x: 400, y: -100 },
    { x: 600, y: -200 },
  ];

  const [ballPosition, setBallPosition] = useState(initialBallPosition);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [obstacles, setObstacles] = useState(initialObstacles);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateObstacle = () => {
    const x = Math.random() * (gameWidth - obstacleWidth);
    const newObstacle = { x, y: 0 };
    setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
  };

  const updateBallPosition = () => {
    if (gameOver) return;

    const newPosition = {
      x: ballPosition.x + velocity.x,
      y: ballPosition.y + velocity.y,
    };

    if (newPosition.x < 0 || newPosition.x > gameWidth) {
      setVelocity({ ...velocity, x: -velocity.x });
    }

    setBallPosition(newPosition);
  };

  const updateObstacles = () => {
    if (gameOver) return;

    setObstacles((prevObstacles) =>
      prevObstacles.map((obstacle) => ({
        ...obstacle,
        y: obstacle.y + obstacleSpeed,
      }))
    );

    // Remove obstacles that are out of the game area
    setObstacles((prevObstacles) =>
      prevObstacles.filter((obstacle) => obstacle.y < gameHeight)
    );

    // Generate new obstacles at the top
    if (Math.random() < 0.02) {
      generateObstacle();
    }
  };

  const checkCollisions = () => {
    obstacles.forEach((obstacle) => {
      if (
        ballPosition.x + ballRadius > obstacle.x &&
        ballPosition.x - ballRadius < obstacle.x + obstacleWidth &&
        ballPosition.y + ballRadius > obstacle.y &&
        ballPosition.y - ballRadius < obstacle.y + obstacleHeight
      ) {
        handleGameOver();
      }
    });
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleKeyPress = (event) => {
    if (!gameOver) {
      const step = 10;
      switch (event.key) {
        case 'ArrowLeft':
          setVelocity({ x: -step, y: 0 });
          break;
        case 'ArrowRight':
          setVelocity({ x: step, y: 0 });
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      if (!gameOver) {
        updateBallPosition();
        updateObstacles();
        checkCollisions();
        setScore((prevScore) => prevScore + 1);
      }
    }, 16);

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoopInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ballPosition, velocity, obstacles, gameOver]);

  return (
    <div className="bg-gray-200 h-screen">
      <div className="container mx-auto mt-8 p-4">
        <h1 className="text-4xl font-bold text-center">Bouncing Ball Game</h1>
        <Score score={score} />
        {!gameOver && <Ball position={ballPosition} radius={ballRadius} />}
        {obstacles.map((obstacle, index) => (
          <Obstacle
            key={index}
            position={obstacle}
            width={obstacleWidth}
            height={obstacleHeight}
          />
        ))}
        {gameOver && (
          <div className="text-center mt-4">
            <p className="text-2xl font-bold">Game Over</p>
            <p className="mt-2">Your Score: {score}</p>
            <button
              onClick={() => {
                setBallPosition(initialBallPosition);
                setObstacles(initialObstacles);
                setScore(0);
                setGameOver(false);
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
