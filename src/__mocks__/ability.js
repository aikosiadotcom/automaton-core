import {jest} from '@jest/globals';
jest.unstable_mockModule("./ability.js",()=>({
    default:class Ability{
        event = {
            once:jest.fn()
        }
    }
}));

export default await import("./ability.js");