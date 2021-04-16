import 'jest-ts-auto-mock';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment-timezone';

const Enzyme = require('enzyme');

const {
  shallow,
  render,
  mount,
} = Enzyme;

global.shallow = shallow;
global.render = render;
global.mount = mount;

Enzyme.configure({ adapter: new Adapter() });

console.error = (message) => { // eslint-disable-line no-console
  throw new Error(message);
};

jest.doMock('moment', () => {
  moment.tz.setDefault('CET');
  return moment;
});

jest.mock('src/i18n', () => ({
  t: (text) => text,
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ([(key) => key]),
}));
