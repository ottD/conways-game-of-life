import React from 'react';
import Board, { ICell } from './Board';
import ControlPanel from './ControlPanel';

interface IGameState {
    cells: ICell[],
    isRunning: boolean,
    refreshInterval: number,
    cellSize: number
}

export default class Game extends React.Component<Readonly<{}>, IGameState> {

    // TODO make grid customizable
    // keep game state in 2D array 
    private gameMatrix: boolean[][] = [];

    private randomFactor = 0.5;

    private rows = 30;
    private columns = 40;
    private timeoutHandler: number = 0;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            cells: [],
            isRunning: false,
            refreshInterval: 100,
            cellSize: 20
        }

        this.gameMatrix = this.createInitialMatrix();
        this.handleBoardClicked = this.handleBoardClicked.bind(this);
        this.handleClearClicked = this.handleClearClicked.bind(this);
        this.handleRandomClicked = this.handleRandomClicked.bind(this);
        this.handleStartClicked = this.handleStartClicked.bind(this);
        this.handleRefreshIntervalChanged = this.handleRefreshIntervalChanged.bind(this);
        this.handleCellSizeChanged = this.handleCellSizeChanged.bind(this);
    }


    render() {
        const { cells, isRunning, cellSize } = this.state;

        return (
            <div>
                <h2>Conway's Game of Life</h2>

                <Board rows={this.rows} columns={this.columns} cellSize={cellSize} cells={cells} onBoardClicked={this.handleBoardClicked} />
                <ControlPanel
                    maxWidth={Math.ceil(this.columns * cellSize)}
                    onClearClicked={this.handleClearClicked}
                    onRandomClicked={this.handleRandomClicked}
                    onStartClicked={this.handleStartClicked}
                    onRefreshIntervalChanged={this.handleRefreshIntervalChanged}
                    onCellSizeChanged={this.handleCellSizeChanged}
                    isRunning={isRunning} />
            </div>
        );
    }

    createInitialMatrix(setRandomValues?: boolean): boolean[][] {
        let matrix: boolean[][] = [];

        // create 2D array        
        for (let x = 0; x < this.rows; x++) {
            matrix[x] = [];
            for (let y = 0; y < this.columns; y++) {
                if (setRandomValues) {
                    matrix[x][y] = (Math.random() > this.randomFactor)
                } else {
                    matrix[x][y] = false;
                }
            }
        }

        return matrix;
    }

    handleBoardClicked(x: number, y: number): void {
        if (x >= 0 && x <= this.rows && y >= 0 && y <= this.columns) {
            this.gameMatrix[x][y] = !this.gameMatrix[x][y];
            this.setState(() => ({
                cells: this.updateCells(this.gameMatrix)
            }));
        }
    }

    handleClearClicked(): void {
        this.gameMatrix = this.createInitialMatrix();
        this.setState(() => ({
            cells: []
        }));
    }

    handleRandomClicked(): void {
        this.gameMatrix = this.createInitialMatrix(true);
        this.setState(() => ({
            cells: this.updateCells(this.gameMatrix)
        }));
    }

    handleRefreshIntervalChanged(interval: number): void {
        this.setState(() => ({
            refreshInterval: interval
        }));
    }


    handleCellSizeChanged(size: number): void {
        this.setState(() => ({
            cellSize: size
        }));
    }

    handleStartClicked(): void {

        const newState = !this.state.isRunning;

        this.setState(() => ({
            isRunning: newState
        }));

        // TODO check whether we need the timeoutHandler 
        if (newState) {
            this.runIteration();
        } else {

            if (this.timeoutHandler) {
                window.clearTimeout(this.timeoutHandler);
                this.timeoutHandler = 0;
            }
        }


    }


    updateCells(gameMatrix: boolean[][]): ICell[] {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                if (gameMatrix[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }



    // TODO update algorithm below 
    runIteration() {
        let newBoard = this.createInitialMatrix();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                let neighbors = this.calculateNeighbors(this.gameMatrix, x, y);
                if (this.gameMatrix[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.gameMatrix[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.gameMatrix = newBoard;
        this.setState(() => ({
            cells: this.updateCells(this.gameMatrix)
        }));


        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.refreshInterval);
    }



    // TODO update algorithm as it is not working properly 
    /**
 * Calculate the number of neighbors at point (x, y)
 * @param {Array} board 
 * @param {int} x 
 * @param {int} y 
 */
    calculateNeighbors(board: boolean[][], x: number, y: number): number {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.columns && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }


    // TODO include JEST and write tests
    // include Fluent UI to have a better looking UI\
    // clean up TSLint 


    //     The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

    //     Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    //     Any live cell with two or three live neighbours lives on to the next generation.
    //     Any live cell with more than three live neighbours dies, as if by overpopulation.
    //     Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

    // These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

    //     Any live cell with two or three neighbors survives.
    //     Any dead cell with three live neighbors becomes a live cell.
    //     All other live cells die in the next generation. Similarly, all other dead cells stay dead.

    // The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations. 


}