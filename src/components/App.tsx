import React from 'react';
import Game from './Game/Game';
import { initializeIcons } from '@uifabric/icons';
import '../styles/index.css';

// initialize Fluent UI icons from default CDN
initializeIcons();

export default class App extends React.PureComponent {
    render() {
        return (
            <div className="App">
                <Game />
            </div>
        );
    }
}