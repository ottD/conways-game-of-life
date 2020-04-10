import React from 'react';
import Cell from './Cell';
import '../styles/Board.css';

export interface ICell {
    x: number,
    y: number
}

export interface IBoardProps {
    rows: number;
    columns: number;
    cellSize: number;
    cellBorderThickness: number;
    cells: ICell[];
    onBoardClicked(x: number, y: number): void
}

export interface IBoardState {
    width: number,
    height: number
}

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
        const { cellSize, cellBorderThickness, cells } = this.props;

        // TODO fix linear gradient for border thickness > 1
        return (
            <div>
                <div className="Board" style={{
                    width: width,
                    height: height,
                    backgroundSize: `${cellSize}px ${cellSize}px`,
                    backgroundImage:
                        `linear-gradient(#333 ${cellBorderThickness}px, transparent ${cellBorderThickness}px),
                         linear-gradient(90deg, #333 ${cellBorderThickness}px, transparent ${cellBorderThickness}px)`}}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardReference = n; }}>

                    {cells.map(cell => (<Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} size={cellSize} border={cellBorderThickness}/> ))}
                </div>
            </div>
        );
    }


    private handleClick = (event: { clientX: number; clientY: number; }) => {
        const { cellSize } = this.props;
        const elemOffset = this.getElementOffset();

        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;

        const x = Math.floor(offsetX / cellSize);
        const y = Math.floor(offsetY / cellSize);

        this.props.onBoardClicked(y, x);
    }


    private getElementOffset(): { x: number, y: number } {
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