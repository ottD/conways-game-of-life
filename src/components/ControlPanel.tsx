import React from 'react';
import '../styles/ControlPanel.css';
import { DefaultButton, IIconProps, Slider, IStackTokens, Stack, ComboBox, IComboBoxOption } from 'office-ui-fabric-react';

export interface IControlPanelProps {
    onRandomClicked(): void;
    onClearClicked(): void;
    onStartClicked(): void;
    onAboutClicked(): void;
    onRefreshIntervalChanged(interval: number): void;
    isRunning: boolean;
    maxWidth: number;
}

const INITIAL_OPTIONS: IComboBoxOption[] = [
    { key: '0', text: 'Glider' },
    { key: '1', text: 'Quadropole' }
];

export default class ControlPanel extends React.Component<IControlPanelProps>  {

    constructor(props: IControlPanelProps) {
        super(props);
    }

    render() {
        const { onRandomClicked, onClearClicked, onStartClicked, onAboutClicked, onRefreshIntervalChanged, isRunning } = this.props;

        const stackTokens: IStackTokens = { childrenGap: 20 };

        const startIcon: IIconProps = { iconName: 'Play' };
        const stopIcon: IIconProps = { iconName: 'Stop' };
        const clearIcon: IIconProps = { iconName: 'Delete' };
        const randomIcon: IIconProps = { iconName: 'NumberSequence' };
        const infoIcon: IIconProps = { iconName: 'Info' };

        return (
            <div className="controls">
                <Stack tokens={stackTokens} styles={{ root: { width: this.props.maxWidth } }} horizontalAlign={'stretch'}>

                    <Stack horizontal className="buttons" tokens={stackTokens} horizontalAlign={'space-around'}>

                        <ComboBox
                            autoComplete="on"
                            placeholder="Select a preset"
                            options={INITIAL_OPTIONS}
                            onFocus={() => console.log('onFocus called for basic uncontrolled example')}
                            onBlur={() => console.log('onBlur called for basic uncontrolled example')}
                            onMenuOpen={() => console.log('ComboBox menu opened')}
                            onPendingValueChanged={(option, pendingIndex, pendingValue) =>
                                console.log(`Preview value was changed. option: ${option}, Pending index: ${pendingIndex}. Pending value: ${pendingValue}.`)
                            } />
                        <DefaultButton
                            onClick={onRandomClicked}
                            iconProps={randomIcon}
                            text={'Random'} />

                        <DefaultButton
                            toggle
                            checked={isRunning}
                            text={isRunning ? 'Stop' : 'Start'}
                            iconProps={isRunning ? stopIcon : startIcon}
                            onClick={onStartClicked} />
                        <DefaultButton
                            onClick={onClearClicked}
                            iconProps={clearIcon}
                            text={'Clear'} />

                        <DefaultButton
                            onClick={onAboutClicked}
                            iconProps={infoIcon}
                            text={`About`} />
                    </Stack>

                    <Slider
                        label={'Refresh Interval in ms'}
                        min={0}
                        max={1000}
                        step={5}
                        defaultValue={100}
                        showValue={true}
                        onChange={(value: number) => onRefreshIntervalChanged(value)} />

                </Stack>
            </div>
        );
    }
}