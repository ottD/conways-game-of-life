import React from 'react';
import Board, { ICell } from '../Board/Board';
import ControlPanel from '../ControlPanel/ControlPanel';
import { InfoPanel } from '../InfoPanel/InfoPanel';

interface IGameState {
    cells: ICell[];
    isRunning: boolean;
    isInfoPanelVisible: boolean;
    refreshInterval: number;
    cellSize: number;
}

const ROWS = 30;
const COLUMNS = 40;
const RANDOM_THRESHOLD = 0.5;

export default class Game extends React.Component<Readonly<{}>, IGameState> {

    // keep game state in 2D array 
    private gameMatrix: boolean[][] = [];
    private timerID = 0;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            cells: [],
            isRunning: false,
            isInfoPanelVisible: false,
            refreshInterval: 100,
            cellSize: 20
        }
        this.handleOnBoardClick = this.handleOnBoardClick.bind(this);
        this.handleOnClear = this.handleOnClear.bind(this);
        this.handleOnRandom = this.handleOnRandom.bind(this);
        this.handleOnStart = this.handleOnStart.bind(this);
        this.handleOnAbout = this.handleOnAbout.bind(this);
        this.handleOnRefreshIntervalChanged = this.handleOnRefreshIntervalChanged.bind(this);
        this.handleOnInfoPanelDismiss = this.handleOnInfoPanelDismiss.bind(this);
        this.handleOnPresetSelected = this.handleOnPresetSelected.bind(this);
    }

    componentDidMount() {
        this.gameMatrix = this.createInitialMatrix();
    }

    render() {
        const { cells, isRunning, isInfoPanelVisible, cellSize } = this.state;
        return (
            <div>
                <Board rows={ROWS} columns={COLUMNS} cellSize={cellSize} cells={cells} onClick={this.handleOnBoardClick} />
                <ControlPanel
                    width={Math.ceil(COLUMNS * cellSize)}
                    onClear={this.handleOnClear}
                    onRandom={this.handleOnRandom}
                    onStart={this.handleOnStart}
                    onAbout={this.handleOnAbout}
                    onPresetSelected={this.handleOnPresetSelected}
                    onRefreshIntervalChanged={this.handleOnRefreshIntervalChanged}
                    isRunning={isRunning} />
                {isInfoPanelVisible && <InfoPanel onDismiss={this.handleOnInfoPanelDismiss} />}
            </div>
        );
    }

    private createInitialMatrix(setRandomCells?: boolean): boolean[][] {
        const matrix: boolean[][] = [];      
        for (let x = 0; x < ROWS; x++) {
            matrix[x] = [];
            for (let y = 0; y < COLUMNS; y++) {
                if (setRandomCells) {
                    matrix[x][y] = (Math.random() > RANDOM_THRESHOLD)
                } else {
                    matrix[x][y] = false;
                }
            }
        }

        return matrix;
    }

    private handleOnBoardClick(x: number, y: number): void {
        if (x >= 0 && x <= ROWS && y >= 0 && y <= COLUMNS) {
            this.gameMatrix[x][y] = !this.gameMatrix[x][y];
            this.setState(() => ({
                cells: this.updateCells(this.gameMatrix)
            }));
        }
    }

    private handleOnClear(): void {
        this.gameMatrix = this.createInitialMatrix();
        this.setState(() => ({
            cells: []
        }));
    }

    private handleOnRandom(): void {
        this.gameMatrix = this.createInitialMatrix(true);
        this.setState(() => ({
            cells: this.updateCells(this.gameMatrix)
        }));
    }

    private handleOnRefreshIntervalChanged(interval: number): void {
        this.setState(() => ({
            refreshInterval: interval
        }));
    }

    private handleOnAbout(): void {
        this.setState(() => ({
            isInfoPanelVisible: true
        }));
    }

    private handleOnPresetSelected(value: string): void {
        this.gameMatrix = this.createPreset(value);
        this.setState(() => ({
            cells: this.updateCells(this.gameMatrix)
        }));
    }

    private handleOnInfoPanelDismiss() {
        this.setState(() => ({
            isInfoPanelVisible: false
        }));
    }

    private handleOnStart(): void {
        const isNowRunning = !this.state.isRunning;
        this.setState(() => ({
            isRunning: isNowRunning
        }));

        if (isNowRunning) {
            this.runIteration();
        } else {
            if (this.timerID) {
                window.clearTimeout(this.timerID);
                this.timerID = 0;
            }
        }
    }

    private createPreset(value: string): boolean[][] {
        const matrix = this.createInitialMatrix();
        switch (value) {
            case "Glider":
                this.createGlider(matrix);
                break;

            case "Spaceship":
                this.createSpaceship(matrix);
                break;
        }
        return matrix;
    }

    private createSpaceship(matrix: boolean[][]) {
        matrix[0][1] = true;
        matrix[0][2] = true;
        matrix[1][0] = true;
        matrix[1][1] = true;
        matrix[1][2] = true;
        matrix[1][3] = true;
        matrix[2][0] = true;
        matrix[2][1] = true;
        matrix[2][3] = true;
        matrix[2][4] = true;
        matrix[3][2] = true;
        matrix[3][3] = true;
    }

    private createGlider(matrix: boolean[][]) {
        matrix[0][0] = true;
        matrix[0][2] = true;
        matrix[1][1] = true;
        matrix[1][2] = true;
        matrix[2][1] = true;
    }

    private updateCells(gameMatrix: boolean[][]): ICell[] {
        const cells = [];
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLUMNS; x++) {
                if (gameMatrix[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    private runIteration() {
        const newGameMatrix = this.createInitialMatrix();

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLUMNS; x++) {
                const neighbors = this.calculateNeighbors(this.gameMatrix, x, y);
                if (this.gameMatrix[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newGameMatrix[y][x] = true;
                    } else {
                        newGameMatrix[y][x] = false;
                    }
                } else {
                    if (!this.gameMatrix[y][x] && neighbors === 3) {
                        newGameMatrix[y][x] = true;
                    }
                }
            }
        }

        this.gameMatrix = newGameMatrix;
        this.setState(() => ({
            cells: this.updateCells(this.gameMatrix)
        }));

        this.timerID = window.setTimeout(() => {
            this.runIteration();
        }, this.state.refreshInterval);
    }

    /**
     * Returns the number of neighbors of cell (x, y)
     * @param {Array} matrix 
     * @param {int} x 
     * @param {int} y 
     */
    private calculateNeighbors(matrix: boolean[][], x: number, y: number): number {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            const y1 = y + dir[0];
            const x1 = x + dir[1];

            if (x1 >= 0 && x1 < COLUMNS && y1 >= 0 && y1 < ROWS && matrix[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }
}