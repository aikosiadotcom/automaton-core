import {jest} from '@jest/globals';

jest.unstable_mockModule('axios',()=>({
    default:{
        get:()=>"mock"
    }
}));

export default await import('axios');