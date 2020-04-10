import React from 'react';
import '../styles/Cell.css';

export interface ICellProps {
    x: number,
    y: number,
    size: number,
    border: number
}

export default class Cell extends React.Component<ICellProps, Readonly<{}>> {
    render() {
        const { x, y, size, border } = this.props;
        return (
            <div className="Cell" style={{
                left: `${size * x + border}px`,
                top: `${size * y + border}px`,
                width: `${size - border}px`,
                height: `${size - border}px`,
            }} />
        );
    }
}