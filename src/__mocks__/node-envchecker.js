import {jest} from '@jest/globals';

jest.unstable_mockModule('node-envchecker',()=>({
    default:jest.fn()
}));

export default await import('node-envchecker');