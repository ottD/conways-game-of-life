import React from 'react';
import '../styles/ControlPanel.css';

export interface IControlPanelProps {
    onRandomClicked(): void,
    onClearClicked(): void,
    onStartClicked(): void,
    onStopClicked(): void
}


export default class ControlPanel extends React.Component<IControlPanelProps>  {

    constructor(props: IControlPanelProps) {
        super(props);
    }

    render() {
        const { onRandomClicked, onClearClicked, onStartClicked, onStopClicked } = this.props;
        return (
            <div className="controls">
                <button className="button" onClick={onRandomClicked}>Random</button>
                <button className="button" onClick={onClearClicked}>Clear</button>
                <button className="button" onClick={onStartClicked}>Start</button>
                <button className="button" onClick={onStopClicked}>Stop</button>
            </div>
        );
    }
}
