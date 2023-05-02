import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import mockLoader from "#mock/plugin_loader"; 
import {resolve} from 'import-meta-resolve';

beforeAll(()=>{
    jest.useFakeTimers(); 
    // jest.runAllTimersAsync();
    // jest.runAllTicks();
    // jest.runAllTimers();
});

afterEach(()=>{
    jest.resetModules();
    jest.clearAllMocks();
});


describe("given Runtime class",()=>{
    describe("when 'run' method is called",()=>{
        test("then will return a immutable object",async()=>{
            await mockApp({showLog:false});
            await mockLoader({case:1});
            const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;
            const runtime = new Runtime({});
            const ret = await runtime.run(); 
            expect(ret.length).toEqual(1);  
            expect(()=>ret[0] = null).toThrow();
            expect(()=>ret[0].main = null).toThrow();
            expect(ret[0]).toHaveProperty("class");
            expect(ret[0]).toHaveProperty("instance");
        });
    });

    describe("when 'run' method is called with ",()=>{
        test("then will return 0 cause the bot dont have export default",async()=>{
            await mockApp({showLog:false});
            await mockLoader({case:2});
            const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;
            const runtime = new Runtime({});
            const ret = await runtime.run(); 
            expect(ret.length).toEqual(0);  
        });
    });

    
    describe("when 'run' method is called with cronjob true",()=>{
        test("then will run normally",async()=>{
            await mockApp({showLog:false});
            await mockLoader({case:3});
            const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;
            const runtime = new Runtime({});
            const ret = await runtime.run(); 
            expect(ret.length).toEqual(1);  
        });
    });
})
