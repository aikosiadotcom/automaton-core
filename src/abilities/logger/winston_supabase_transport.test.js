import {describe,test,expect ,jest} from '@jest/globals';
import WinstonSupabaseTransport from "./winston_supabase_transport.js";
import supabase from '../../__mocks__/supabase.js';

let mockFn = jest.fn();;
const getInstance = (args)=>new WinstonSupabaseTransport(args);

afterEach(()=>{
    jest.clearAllMocks();
});

describe("instantiation",()=>{

    test("when no parameters pass to constructor",()=>{
        expect(getInstance).toThrow(Error);
    });

    test("log",async()=>{
        jest.useFakeTimers();
        let counter = 0;
        const logger = getInstance({tableName:'winston_logs',supabaseClient:supabase});
        logger.on("logged",(args)=>counter++);
        await logger.log({message:"good quality code"},mockFn);

        jest.runAllTimers();
        expect(supabase.get()[0].message).toEqual("good quality code");
        expect(counter).toBe(1);
    });
});

