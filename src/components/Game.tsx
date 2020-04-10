import React from 'react';
import Board, { ICell } from './Board';
import ControlPanel from './ControlPanel';

interface IGameState{
    cells: ICell[],
    isRunning: boolean,
    refreshInterval: number
}

export default class Game extends React.Component<Readonly<{}>, IGameState> {

    // TODO make grid customizable
    // keep game state in 2D array 
    private gameMatrix: boolean[][]= [];

    private cellSize = 20;
    private cellBorderThickness = 1;

    private randomFactor = 0.7;

    private rows = 30;
    private columns = 40;
    private timeoutHandler: number = 0;
   
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {   
            cells: [],
            isRunning: false, 
            refreshInterval: 100
        }

        this.gameMatrix = this.createInitialMatrix();
        this.handleBoardClicked = this.handleBoardClicked.bind(this);
        this.handleClearClicked = this.handleClearClicked.bind(this);
        this.handleRandomClicked = this.handleRandomClicked.bind(this);
        this.handleStartClicked = this.handleStartClicked.bind(this);
        this.handleStopClicked = this.handleStopClicked.bind(this);
    }


    render() {
        const {cells} = this.state;

        return (
            <div>
                <Board rows={this.rows} columns={this.columns} cellSize={this.cellSize} cellBorderThickness={this.cellBorderThickness} cells={cells} onBoardClicked={this.handleBoardClicked}/>
                <ControlPanel onClearClicked={this.handleClearClicked} onRandomClicked={this.handleRandomClicked} onStartClicked={this.handleStartClicked} onStopClicked={this.handleStopClicked}/>
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
                cells:  this.updateCells(this.gameMatrix)        
            }));
        }
    }

    handleClearClicked() : void {
        this.gameMatrix = this.createInitialMatrix();
        this.setState(() => ({
            cells:  []      
        }));
    }

    handleRandomClicked() : void {
        this.gameMatrix = this.createInitialMatrix(true);
        this.setState(() => ({
            cells: this.updateCells(this.gameMatrix)      
        }));
    }

    handleStartClicked() : void {
        this.setState(() => ({
            isRunning: true     
        }));

        this.runIteration(); 

    }


    // TODO check whether we need the timeoutHandler 
    handleStopClicked() : void {
        this.setState(() => ({
            isRunning: false     
        }));

        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = 0;
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
    calculateNeighbors(board:boolean[][], x:number, y:number): number {
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

}