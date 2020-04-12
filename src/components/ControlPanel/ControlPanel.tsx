import React from 'react';
import '../../styles/ControlPanel.css';
import { DefaultButton, IIconProps, Slider, IStackTokens, Stack, ComboBox, IComboBoxOption } from 'office-ui-fabric-react';

export interface IControlPanelProps {
    onRandom(): void;
    onClear(): void;
    onStart(): void;
    onAbout(): void;
    onRefreshIntervalChanged(interval: number): void;
    onPresetSelected(value: string): void,
    isRunning: boolean;
    width: number;
}

interface IControlPanelState {
    selectedOptionKey: string | number;
}

const PRESET_OPTIONS: IComboBoxOption[] = [
    { key: 'Glider', text: 'Glider' },
    { key: 'Spaceship', text: 'Spaceship' },
];

export default class ControlPanel extends React.Component<IControlPanelProps, IControlPanelState>  {

    constructor(props: IControlPanelProps) {
        super(props);
        this.state = {
            selectedOptionKey: 0
        }
    }

    render() {
        const { onRandom: onRandomClicked, onStart: onStartClicked, onAbout: onAboutClicked, onRefreshIntervalChanged, isRunning } = this.props;
        const stackTokens: IStackTokens = { childrenGap: 20 };
        const startIcon: IIconProps = { iconName: 'Play' };
        const stopIcon: IIconProps = { iconName: 'Stop' };
        const clearIcon: IIconProps = { iconName: 'Delete' };
        const randomIcon: IIconProps = { iconName: 'NumberSequence' };
        const infoIcon: IIconProps = { iconName: 'Info' };

        return (
            <div className="controls">
                <Stack tokens={stackTokens} styles={{ root: { width: this.props.width } }} horizontalAlign={'stretch'}>
                    <Stack horizontal tokens={stackTokens} horizontalAlign={'space-around'}>
                        <ComboBox
                            autoComplete="on"
                            placeholder="Select a preset"
                            selectedKey={this.state.selectedOptionKey}
                            options={PRESET_OPTIONS}
                            onChange={(_, option) => this.onChange(option)} />
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
                            onClick={() => this.onClear()}
                            iconProps={clearIcon}
                            text={'Clear'} />
                        <DefaultButton
                            onClick={onAboutClicked}
                            iconProps={infoIcon}
                            text={`About`} />
                    </Stack>
                    <Slider
                        label={'Refresh interval in ms'}
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

    private onChange(option: IComboBoxOption | undefined) {
        if (option) {
            this.setState({
                selectedOptionKey: option.key,
            });
            this.props.onPresetSelected(option.key as string)
        }
    };

    private onClear() {
        this.setState({
            selectedOptionKey: 0
        });
        this.props.onClear()
    }
}