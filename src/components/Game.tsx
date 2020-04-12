import React from 'react';
import Board, { ICell } from './Board';
import ControlPanel from './ControlPanel';
import { InfoPanel } from './InfoPanel/InfoPanel';

interface IGameState {
    cells: ICell[];
    isRunning: boolean;
    isInfoPanelVisible: boolean;
    refreshInterval: number;
    cellSize: number;
}

export default class Game extends React.Component<Readonly<{}>, IGameState> {

    // keep game state in 2D array 
    private gameMatrix: boolean[][] = [];

    private randomFactor = 0.5;
    private rows = 30;
    private columns = 40;
    private timeoutHandler = 0;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            cells: [],
            isRunning: false,
            isInfoPanelVisible: false,
            refreshInterval: 100,
            cellSize: 20
        }

        this.gameMatrix = this.createInitialMatrix();
        this.handleBoardClicked = this.handleBoardClicked.bind(this);
        this.handleClearClicked = this.handleClearClicked.bind(this);
        this.handleRandomClicked = this.handleRandomClicked.bind(this);
        this.handleStartClicked = this.handleStartClicked.bind(this);
        this.handleAboutClicked = this.handleAboutClicked.bind(this);
        this.handleRefreshIntervalChanged = this.handleRefreshIntervalChanged.bind(this);
        this.handleInfoPanelDismissed = this.handleInfoPanelDismissed.bind(this); 
        this.handlePresetChanged = this.handlePresetChanged.bind(this);
    }


    render() {
        const { cells, isRunning, isInfoPanelVisible, cellSize } = this.state;

        return (
            <div>
                <Board rows={this.rows} columns={this.columns} cellSize={cellSize} cells={cells} onBoardClicked={this.handleBoardClicked} />
                <ControlPanel
                    maxWidth={Math.ceil(this.columns * cellSize)}
                    onClearClicked={this.handleClearClicked}
                    onRandomClicked={this.handleRandomClicked}
                    onStartClicked={this.handleStartClicked}
                    onAboutClicked={this.handleAboutClicked}
                    onPresetChangged = {this.handlePresetChanged}
                    onRefreshIntervalChanged={this.handleRefreshIntervalChanged}
                    isRunning={isRunning} />
                {isInfoPanelVisible && <InfoPanel onDismiss={this.handleInfoPanelDismissed}/>}              
            </div>
        );
    }

    createInitialMatrix(setRandomValues?: boolean): boolean[][] {
        const matrix: boolean[][] = [];

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

    handleAboutClicked(): void {
        this.setState(() => ({
            isInfoPanelVisible: true
        }));
    }

    handlePresetChanged(value: string): void {
        this.gameMatrix = this.createPreset(value); 
        this.setState(() => ({
            cells: this.updateCells(this.gameMatrix)
        }));
    }

    handleInfoPanelDismissed() {
        this.setState(() => ({
            isInfoPanelVisible: false
        }));
    }

    createPreset(value: string): boolean[][] {
        const matrix = this.createInitialMatrix();

        if (value == "Glider") {
            matrix[0][0]= true;
            matrix[0][2]= true;
            matrix[1][1]= true;
            matrix[1][2]= true;
            matrix[2][1]= true;
        } else if (value=="Spaceship" ) {
            matrix[0][1]= true;
            matrix[0][2]= true;
            matrix[1][0]= true;
            matrix[1][1]= true;
            matrix[1][2]= true;
            matrix[1][3]= true;
            matrix[2][0]= true;
            matrix[2][1]= true;
            matrix[2][3]= true;
            matrix[2][4]= true;
            matrix[3][2]= true;
            matrix[3][3]= true;
        }

    
        return matrix;
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
        const cells = [];
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
        const newBoard = this.createInitialMatrix();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                const neighbors = this.calculateNeighbors(this.gameMatrix, x, y);
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
            const y1 = y + dir[0];
            const x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.columns && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }
}