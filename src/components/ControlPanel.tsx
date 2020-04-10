import React from 'react';
import '../styles/ControlPanel.css';

export interface IControlPanelProps {
    onRandomClicked(): void
    onClearClicked(): void
}


export default class ControlPanel extends React.Component<IControlPanelProps>  {

    constructor(props: IControlPanelProps) {
        super(props);
    }

    render() {
        const { onRandomClicked, onClearClicked } = this.props;
        return (
            <div className="controls">
                <button className="button" onClick={onRandomClicked}>Random</button>
                <button className="button" onClick={onClearClicked}>Clear</button>
            </div>
        );
    }
}
