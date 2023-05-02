import {jest} from '@jest/globals';

jest.unstable_mockModule('dotenv',()=>({
    config:jest.fn()
}));

export default await import('dotenv');

