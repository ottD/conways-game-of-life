import React from 'react';
import '../styles/ControlPanel.css';
import { DefaultButton, IIconProps, Slider, IStackTokens, Stack } from 'office-ui-fabric-react';

export interface IControlPanelProps {
    onRandomClicked(): void,
    onClearClicked(): void,
    onStartClicked(): void,
    onRefreshIntervalChanged(interval: number): void;
    onCellSizeChanged(interval: number): void;
    isRunning: boolean;
    maxWidth: number;
}


export default class ControlPanel extends React.Component<IControlPanelProps>  {

    constructor(props: IControlPanelProps) {
        super(props);
        this.refreshIntervalChanged = this.refreshIntervalChanged.bind(this);
    }



    render() {
        const { onRandomClicked, onClearClicked, onStartClicked, isRunning } = this.props;

        const stackTokens: IStackTokens = { childrenGap: 20 };

        const startIcon: IIconProps = { iconName: 'Play' };
        const stopIcon: IIconProps = { iconName: 'Stop' };
        const clearIcon: IIconProps = { iconName: 'Delete' };
        const randomIcon: IIconProps = { iconName: 'NumberSequence' };

        return (
            <div className="controls">
                <Stack tokens={stackTokens} styles={{ root: { width: this.props.maxWidth } }}>

                    <div className="buttons">
                        <DefaultButton
                            // className="button"
                            onClick={onRandomClicked}
                            iconProps={randomIcon}
                            text={'Random'} />
                        <DefaultButton
                            className="button"
                            onClick={onClearClicked}
                            iconProps={clearIcon}
                            text={'Clear'} />
                        <DefaultButton
                            className="button"
                            toggle
                            checked={isRunning}
                            text={isRunning ? 'Stop' : 'Start'}
                            iconProps={isRunning ? stopIcon : startIcon}
                            onClick={onStartClicked} />

                    </div>

                    <Slider
                        label={'Refresh Interval in ms'}
                        min={0}
                        max={1000}
                        step={5}
                        defaultValue={100}
                        showValue={true}
                        onChange={(value: number) => this.refreshIntervalChanged(value)} />

                    <Slider
                        disabled={true}
                        label={'Cell size'}
                        min={1}
                        max={60}
                        step={1}
                        defaultValue={20}
                        showValue={true}
                        onChange={(value: number) => this.cellSizeChanged(value)} />

                </Stack>
            </div>
        );
    }

    private refreshIntervalChanged(interval: number): void {
        this.props.onRefreshIntervalChanged(interval);
    }

    private cellSizeChanged(interval: number): void {
        this.props.onCellSizeChanged(interval);
    }
}
