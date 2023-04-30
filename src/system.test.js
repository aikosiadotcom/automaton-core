import {describe,test,expect ,jest} from '@jest/globals';
import * as system from "./system.js";

describe("given getPath method",()=>{
    describe("when no argument is given",()=>{
        test("then it will return object",()=>{
            expect(system.getPath()).toHaveProperty("config")
        });
    });
    describe("when argument is 'env'",()=>{
        test("then location env file will be return",()=>{
            expect(system.getPath("env")).toBeTruthy();
        });
    });
    describe("when argument is 'config'",()=>{
        test("then location 'config' file will be return",()=>{
            expect(system.getPath("env")).toBeTruthy();
        });
    });
    describe("when the given argument key not found on the system",()=>{
        test("then undefined will be return",()=>{
            expect(system.getPath("test")).toBeUndefined();
        });
    });
});