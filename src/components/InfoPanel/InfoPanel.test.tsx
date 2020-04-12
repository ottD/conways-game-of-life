import * as React from 'react';
import { InfoPanel } from './InfoPanel';
import EnzymeToJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

describe('InfoPanel snapshot', () => {
    it('renders correctly', () => {
        const component = shallow(<InfoPanel onDismiss={()=>undefined}/>);
        expect(EnzymeToJson(component)).toMatchSnapshot();
    });
})