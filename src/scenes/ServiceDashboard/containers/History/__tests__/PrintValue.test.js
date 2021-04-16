import React from 'react';
import renderer from 'react-test-renderer';
import PrintValue from '../PrintValue';

describe('PrintValue component', () => {
  it('should print dash', () => {
    const tree = renderer.create(<PrintValue value="null" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should print ownerContact value', () => {
    const tree = renderer.create(<PrintValue value="Janine Bieri (ID 3547)" trigger="ownerContact" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should print classifiedsSalesContact value', () => {
    const tree = renderer
      .create(<PrintValue value="Matthias Mahler (ID 4527)" trigger="classifiedsSalesContact" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should print sequence', () => {
    const tree = renderer.create(<PrintValue value="[ADVERTISER, AGENCY, PUBLISHER]" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should print value', () => {
    const tree = renderer.create(<PrintValue value="Foo bar" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
