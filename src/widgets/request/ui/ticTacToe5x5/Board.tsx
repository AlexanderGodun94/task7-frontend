// Board.tsx
import React from 'react';
import Cell from './Cell';
import {Select} from "antd";

interface BoardProps {
    board: Array<string | null>;
    onCellClick: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick }) => {
    return (
        <table style={{width: 350, height: 350}}className="board">
            <tbody>
            {[0, 1, 2, 3, 4].map((rowIndex) => (
                <tr key={rowIndex}>
                    {[0, 1, 2, 3, 4].map((colIndex) => {
                        const index = rowIndex * 5 + colIndex;
                        return (
                            <td key={colIndex}>
                                <Cell value={board[index]} onClick={() => onCellClick(index)} />
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Board;
