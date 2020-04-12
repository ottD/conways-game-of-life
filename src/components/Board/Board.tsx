import React from 'react';
import '../../styles/Board.css';
import Cell from './Cell';

export interface ICell {
    x: number;
    y: number;
}

export interface IBoardProps {
    rows: number;
    columns: number;
    cellSize: number;
    cells: ICell[];
    onClick(x: number, y: number): void;
}

interface IBoardState {
    width: number;
    height: number;
}

const CELL_BORDER = 1;

export default class Board extends React.Component<IBoardProps, IBoardState>  {
    private boardReference: HTMLDivElement | null = null;

    constructor(props: IBoardProps) {
        super(props);

        const { rows, columns, cellSize } = props;
        this.state = {
            width: Math.ceil(columns * cellSize),
            height: Math.ceil(rows * cellSize)
        }
    }

    render() {
        const { width, height } = this.state;
        const { cellSize, cells } = this.props;

        return (
            <div className="board"
                style={{
                    width: width,
                    height: height,
                    backgroundSize: `${cellSize}px ${cellSize}px`,
                    backgroundImage:
                        `linear-gradient(#333 ${CELL_BORDER}px, transparent ${CELL_BORDER}px),
                        linear-gradient(90deg, #333 ${CELL_BORDER}px, transparent ${CELL_BORDER}px)`
                }}
                onClick={this.onClick}
                ref={(n) => { this.boardReference = n; }}>

                {cells.map(cell => (<Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} size={cellSize} border={CELL_BORDER} />))}
            </div>
        );
    }

    private onClick = (event: { clientX: number; clientY: number }) => {
        const { cellSize } = this.props;
        const elemOffset = this.getElementOffset();

        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;

        const x = Math.floor(offsetX / cellSize);
        const y = Math.floor(offsetY / cellSize);
        this.props.onClick(y, x);
    }

    private getElementOffset(): { x: number; y: number } {
        if (this.boardReference != null) {
            const rect = this.boardReference.getBoundingClientRect();
            const doc = document.documentElement;

            return {
                x: (rect.left + window.pageXOffset) - doc.clientLeft,
                y: (rect.top + window.pageYOffset) - doc.clientTop,
            };
        }

        return { x: 0, y: 0 };
    }
}