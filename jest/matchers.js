/* global jasmine */

import * as immutableMatchers from 'jest-immutable-matchers';
import enzymeMatchers from 'enzyme-matchers';

jasmine.getEnv().beforeEach(() => {
  jasmine.addMatchers(immutableMatchers);
  jasmine.addMatchers(enzymeMatchers);
});
