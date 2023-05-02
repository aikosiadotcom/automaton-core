import {jest} from '@jest/globals';

async function main({throwError = false}){
    jest.unstable_mockModule('node-envchecker',()=>({
        default:throwError ? ()=> { throw new Error() } : jest.fn()
    }));
    await import('node-envchecker');
}

export default (opts)=>main(opts);