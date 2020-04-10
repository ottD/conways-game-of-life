import React from 'react';

import '../styles/index.css';
import Game from './Game';

export interface IAppProps {}

export interface IAppState {}

class App extends React.PureComponent<IAppProps, IAppState> {
	render() {
		return (
            <div className="App">
                <h1>Conway's Game of Life</h1>
                <Game />
            </div>
		);
	}
}

export default App;