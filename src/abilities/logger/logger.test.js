import {describe,test,expect ,jest} from '@jest/globals';
import Logger from "./logger.js";
import supabase from '../../__mocks__/supabase.js';

let instance,mockFn;
const getInstance = (args)=>new Logger(args);

beforeEach(()=>{
    instance = getInstance();
    mockFn = jest.fn();
    global.console = {log:mockFn}
});

afterEach(()=>{
    jest.clearAllMocks();
});

describe("given Logger class",()=>{

    describe("when there's no options pass to constructor",()=>{

        test("then should only log to console",async()=>{

            const logger = getInstance();
    
            logger.log("info","hello world");
            expect(JSON.parse(mockFn.mock.lastCall[0])).toEqual({
                "level": "info",
                "message": "hello world",
                "module_key": "",
                "project_key": "",
                "child_module_key":""
            }); 

        });
    
    });

    describe("when supabase client is pass to the constructor",()=>{

        test("then what you log will also pass to supabase client automatically",async()=>{
            const logger = getInstance({supabase:supabase});
    
            await logger.log("info","awesome");

            expect(supabase.get()[0].message).toEqual("awesome");
        });

    });
});