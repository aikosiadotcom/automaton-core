import {describe,test,expect ,jest} from '@jest/globals';
import * as system from "./system.js";

test("getPath",()=>{
    expect(system.getPath("t")).toBeUndefined();
    expect(system.getPath("")).toBeTruthy();
});

describe("getCurrentEnv",()=>{
    test("NODE_ENV set to development",()=>{
        process.env.NODE_ENV = 'development';
        expect(system.getCurrentEnv()).toEqual(process.env.NODE_ENV.split("").map((v)=>{
            if(v == 'd') return 'D';
            return v;
        }).join(""));
    });

    test("NODE_ENV set to production",()=>{
        process.env.NODE_ENV = 'production';
        expect(system.getCurrentEnv()).toEqual(process.env.NODE_ENV.split("").map((v)=>{
            if(v == 'p') return 'P';
            return v;
        }).join(""));
    })
});