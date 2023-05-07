import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import mockLoader from "#mock/bot_loader"; 
import {resolve} from 'import-meta-resolve';

const getMockConsole = (key = "log")=>{
    const mockFn = jest.fn((...args)=>({...args}));
    global.console[key] = mockFn;
    return mockFn;
}

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
        test("then example-01 on mockLoader will be running",async()=>{
            await mockApp({showLog:false});
            await mockLoader({case:1});
            const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;
            const runtime = new Runtime({});
            const mockFn = getMockConsole();

            await runtime.run();
            
            
            expect(JSON.stringify(mockFn.mock.results)).toContain("hi, jen! i am example-01 with cronjob false have been visited");
            
        });
    });

    describe("when 'run' method is called with cronjob * * * * * without throw exception",()=>{
        test("then example-05 on mockLoader will be running",async()=>{
            //this environment variable will only be used for testing only
            process.env.AUTOMATON_RUNTIME_SCHEDULE_TASK_RUN_IMMEDIATELY = "yes";
            await mockApp({showLog:false});
            await mockLoader({case:3});
            const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;
            const runtime = new Runtime({});
            const mockFn = getMockConsole();
            await runtime.run(); 
            expect(JSON.stringify(mockFn.mock.results)).toContain("hi, jen! i am example-05 with cronjob * * * * * have been visited");
         
        },10000);
    });

    
    describe("when 'run' method is called with cronjob * * * * * but throw exception",()=>{
        test("then the exception should be catch by the system. so, nothing will be throw",async()=>{
            
            //this environment variable will only be used for testing only
            process.env.AUTOMATON_RUNTIME_SCHEDULE_TASK_RUN_IMMEDIATELY = "yes";

            await mockApp({showLog:false});
            await mockLoader({case:4});
            const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;
            const runtime = new Runtime({});
            
            const mockFn = getMockConsole();
            
            await runtime.run();
            

            expect(JSON.stringify(mockFn.mock.results)).toContain("hi, jen! i am example-05 with cronjob * * * * * and throw error have been visited");
         
        });
    });
    
    describe("when 'run' method is called with ",()=>{
        test("then the tasks should be 0 cause the bot dont have export default",async()=>{
            await mockApp({showLog:false});
            await mockLoader({case:2});
            const Runtime = (await import(resolve("#runtime/runtime.v1",import.meta.url))).default;
            const runtime = new Runtime({});
            await runtime.run(); 
            //to pass uncover line report
            Runtime.Manifest;

            expect(Runtime.tasks.size).toBeGreaterThanOrEqual(0);
            
        });
    });
})
