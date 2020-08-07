import React from 'react';
import _ from 'lodash';

const Board = ({size, snake, food}) => {
    const renderBoard = () => {
        const board = [];
        for (let row = 1; row <= size; row++) {
            for (let col = 1; col <= size; col++) {
                let classes = 'square';
                let square = {row: row, col: col};
                if (snake.head.row === row && snake.head.col === col)
                    classes += ' head';
                if (food.row === row && food.col === col)
                    classes += ' food';
                if (_.some(snake.body, square)) {
                    classes += ' snake';
                }
                
                board.push(
                    <div row={row} column={col} className={classes} key={`${row} ${col}`}></div>
                );
            }
        }
        return board;
    }

    return (
        <div className="board container" style={{width: `${30*size}px`}}>
            {renderBoard()}
        </div>
    );
}

export default Board;