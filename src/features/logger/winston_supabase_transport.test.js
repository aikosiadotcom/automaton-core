import {describe,test,expect ,jest} from '@jest/globals';
import WinstonSupabaseTransport from "./winston_supabase_transport.js";
import supabase from '#mock/supabase';

let mockFn = jest.fn();;
const getInstance = (args)=>new WinstonSupabaseTransport(args);

afterEach(()=>{
    jest.clearAllMocks();
});

describe("given WinstonSupabaseTransport",()=>{

    describe("when there's no options pass to constructor",()=>{

        test("then throw error",()=>{
            expect(()=>getInstance({})).toThrow();
        });

    });

    describe("when the required options (tableName,supabaseClient) provided", ()=>{

        test("then you get the instance and test it's 'log' method",async()=>{
            jest.useFakeTimers();
            let counter = 0;
            const logger = getInstance({tableName:'winston_logs',supabaseClient:supabase});
            logger.on("logged",(args)=>counter++);
            await logger.log({message:"good quality code"},mockFn);
    
            jest.runAllTimers();
            expect(supabase.get()[0].message).toEqual("good quality code");
            expect(counter).toBe(1);
        });

    })

});

