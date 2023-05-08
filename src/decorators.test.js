import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import { BABEL_OPTIONS } from '#runtime/compiler/generator';
import * as babel from "@babel/core";
import fsExtra from 'fs-extra';
import {resolve} from 'import-meta-resolve';

await mockApp(jest);
const {code} = await babel.transformFileAsync(resolve("#mock/decorators",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://",""), BABEL_OPTIONS);

await fsExtra.ensureFile(resolve("#mock/decorators-compiled",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://",""));
await fsExtra.writeFile(resolve("#mock/decorators-compiled",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://",""),code);

const {default:Test} = await import(resolve("#mock/decorators-compiled",import.meta.url));

beforeAll(()=>{
    jest.useFakeTimers(); 
    jest.runAllTimersAsync();
});

describe("given decorators module",()=>{
    describe("when dowhile function is used",()=>{
        test("then the counter should return 4 based on hard coded Test Class", async()=>{
            const instance = new Test();
            await instance.dowhile1();
            expect(instance.counter).toBe(4);
        });
    });
    
    describe("when delay function is used",()=>{
        test("then log console contains 'hi, jen !' based on hardcoded Test Class", async()=>{
            const mockFn = jest.fn((...args)=>({...args}));
            const tmpConsoleLog = global.console.log;
            global.console.log = mockFn;

            const instance = new Test();
            await instance.delay1();
            await instance.delay2();
            expect(JSON.stringify(mockFn.mock.results)).toContain("30");
            expect(JSON.stringify(mockFn.mock.results)).toContain("hi, jen !");
            expect(JSON.stringify(mockFn.mock.results)).toContain("test this");
            
            global.console.log = tmpConsoleLog;
        });
    });

    
    describe("when retry function is used",()=>{
        test("then log console contains 'hi, firman !' based on hardcoded Test Class", async()=>{

            const mockFn = jest.fn((...args)=>({...args}));
            const tmpConsoleLog = global.console.log;
            global.console.log = mockFn;

            const instance = new Test();
            
           await expect(async()=>await instance.retry2()).rejects.toThrow();
           const t = await instance.retry1();
           await expect(t).toEqual("hi, firman !");
            
            global.console.log = tmpConsoleLog;
        },10000);
    });
});