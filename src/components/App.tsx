import React from 'react';
import Game from './Game';
import { initializeIcons } from '@uifabric/icons';
import '../styles/index.css';

initializeIcons();

export interface IAppProps { }

export interface IAppState { }

export default class App extends React.PureComponent<IAppProps, IAppState> {
    render() {
        return (
            <div className="App">
                    <h2>Conway's Game of Life</h2>
                    <Game />
            </div>
        );
    }
}
