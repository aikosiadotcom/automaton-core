import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import mockLoader from "#mock/plugin_loader"; 
import {resolve} from 'import-meta-resolve';

await mockApp({showLog:false});
await mockLoader();
const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;

beforeAll(()=>{
    jest.useFakeTimers(); 
});

describe("given Runtime class",()=>{
    describe("when 'run' method is called",()=>{
        test("then will return a immutable object",async()=>{
            const runtime = new Runtime();
            const ret = await runtime.run(); 
            expect(ret.length).toEqual(1);  
            expect(()=>ret[0] = null).toThrow();
            expect(()=>ret[0].main = null).toThrow();
            expect(ret[0]).toHaveProperty("class");
            expect(ret[0]).toHaveProperty("instance");
        });
    });
})
