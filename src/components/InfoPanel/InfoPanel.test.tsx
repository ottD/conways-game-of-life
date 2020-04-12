import * as React from 'react';
import { InfoPanel } from './InfoPanel';
import EnzymeToJson from 'enzyme-to-json';
import { shallow, mount } from 'enzyme';
import { PrimaryButton } from 'office-ui-fabric-react';

describe('InfoPanel snapshot', () => {
    it('renders correctly', () => {
        const component = shallow(<InfoPanel onDismiss={()=>undefined}/>);
        expect(EnzymeToJson(component)).toMatchSnapshot();
    });
})

describe('InfoPanel functionality', () => {
    it('dismisses info panel', async () => {
        const onDismiss = jest.fn();
        const component = mount(<InfoPanel onDismiss={onDismiss}/>);

        expect(component.find(PrimaryButton)).toHaveLength(1);
        component.find(PrimaryButton).simulate('click');

        expect(onDismiss).toHaveBeenCalled();
        component.unmount();
    });
})