import React from 'react';
import Board, { ICell } from './Board';
import ControlPanel from './ControlPanel';

interface IGameState{
    cells: ICell[]
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
   
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {   
            cells: []
        }

        this.gameMatrix = this.createInitialMatrix();
        this.handleBoardClicked = this.handleBoardClicked.bind(this);
        this.handleClearClicked = this.handleClearClicked.bind(this);
        this.handleRandomClicked = this.handleRandomClicked.bind(this);
    }


    render() {
        const {cells} = this.state;

        return (
            <div>
                <Board rows={this.rows} columns={this.columns} cellSize={this.cellSize} cellBorderThickness={this.cellBorderThickness} cells={cells} onBoardClicked={this.handleBoardClicked}/>
                <ControlPanel onClearClicked={this.handleClearClicked} onRandomClicked={this.handleRandomClicked}/>
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

}