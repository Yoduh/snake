import React, { useState, useEffect, useRef } from 'react';
import Board from './Board';
import _ from 'lodash';
import Dropdown from 'react-bootstrap/Dropdown';
import './styles.css';

function App() {
  const getRandomFood = () => {
    return {
      row: Math.floor((Math.random() * size + 1)), 
      col: Math.floor((Math.random() * size + 1))
    }
  }
  
  const [size, setSize] = useState(10);
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState({head: {row: size / 2, col: size / 2}, body: []});
  const [food, setFood] = useState(getRandomFood())
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState('');
  const directionRef = useRef(direction);
  const prevDirectionRef = useRef(direction);
  const snakeRef = useRef(snake);
  let prevHeadPos;

  const resetGame = () => {
    setDirection('');
    setSnake({head: {row: Math.round(size / 2), col: Math.round(size / 2)}, body: []});
    setScore(0);
    setFood(getRandomFood());
    setGameOver(false);
  }

  const handleKeyDown = (e) => {
    if (e === undefined)
      return;
    prevHeadPos = snakeRef.current.head;
    switch (e.keyCode) {
      case 37:
        if (prevDirectionRef.current !== 'right' || snakeRef.current.body.length === 0)
          setDirection('left');
        break;
      case 38:
        if (prevDirectionRef.current !== 'down' || snakeRef.current.body.length === 0)
          setDirection('up');
        break;
      case 39:
        if (prevDirectionRef.current !== 'left' || snakeRef.current.body.length === 0)
          setDirection('right');
        break;
      case 40:
        if (prevDirectionRef.current !== 'up' || snakeRef.current.body.length === 0)
          setDirection('down');
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', (e) => handleKeyDown(e));
  }, [handleKeyDown]);
  useEffect(() => {
    directionRef.current = direction;
  }, [direction])

  useEffect(() => {
    let gameTick = null;
    // out of bounds death
    if (snake.head.row <= 0 || snake.head.row > size || snake.head.col <= 0 || snake.head.col > size) {
      setGameOver(true);
      return;
    }
    // collision with self death
    if (_.some(snake.body, {row: snake.head.row, col: snake.head.col})) {
      setGameOver(true);
      return;
    }
    let newBody;
    if (snake.head.row === food.row && snake.head.col === food.col) {
      newBody = [...snake.body, {row: snake.head.row, col: snake.head.col}];
      setFood(getRandomFood());
      setScore(score => score + 10);
    } else {
      newBody = [...snake.body, {row: snake.head.row, col: snake.head.col}];
      newBody.shift();
    }
    snakeRef.current = snake;

    gameTick = setTimeout(() => {
      switch(directionRef.current) {
        case 'up':
          prevDirectionRef.current = 'up';
          setSnake({...snake, 
            head: {row: snake.head.row - 1, col: snake.head.col}, 
            body: [...newBody]
          });
          break;
        case 'down':
          prevDirectionRef.current = 'down';
          setSnake({...snake, 
            head: {row: snake.head.row + 1, col: snake.head.col}, 
            body: [...newBody]});
          break;
        case 'left':
          prevDirectionRef.current = 'left';
          setSnake({...snake, 
            head: {row: snake.head.row, col: snake.head.col - 1}, 
            body: [...newBody]});
          break;
        case 'right':
          prevDirectionRef.current = 'right';
          setSnake({...snake, 
            head: {row: snake.head.row, col: snake.head.col + 1}, 
            body: [...newBody]});
          break;
        default:
          setSnake({...snake})
          break;
      }
    }, speed);

    return () => {clearTimeout(gameTick)}
  }, [snake]);

  return (
    <div className="container justify-content-center text-center">
      <h1>SNAKE GAME</h1>
      <p><em>press any arrow key to start</em></p>
      <div className="row d-flex justify-content-center text-center">
        Score: {score}
      </div>
      <div>{gameOver ? 'Game Over!' : ` `}</div>
      <div className="row">
        <Board size={size} snake={snake} food={food}/>
      </div>
      <div className="row d-flex justify-content-center mt-3">
        <button className="btn btn-primary reset mr-3" onClick={() => resetGame()}>Reset</button>
        <Dropdown className="mr-3">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Size
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSize(10)}>10x10 (default)</Dropdown.Item>
            <Dropdown.Item onClick={() => setSize(15)}>15x15</Dropdown.Item>
            <Dropdown.Item onClick={() => setSize(25)}>25x25</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="mr-3">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Speed
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSpeed(1000)}>Slow</Dropdown.Item>
            <Dropdown.Item onClick={() => setSpeed(200)}>Normal (default)</Dropdown.Item>
            <Dropdown.Item onClick={() => setSpeed(80)}>Fast</Dropdown.Item>
            <Dropdown.Item onClick={() => setSpeed(20)}>Ludicrous Speed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default App;
