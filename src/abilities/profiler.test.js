import {describe,test,expect ,jest} from '@jest/globals';
import Profiler from "./profiler.js";

const getInstance = (args)=>new Profiler(args);

describe("given a Profiler class",()=>{
    
    describe("when method start and stop is called without argument",()=>{
        
        test("then executionTimeReport will have 'default' as property name",async()=>{
            const profiler = getInstance();

            profiler.start();
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    return resolve();
                },1000)
            });
            const measureResult = profiler.stop();
            expect(measureResult.name).toEqual("default");
        });
    });

    describe("when method start and stop is called with the same argument name",()=>{

        test('then executionTimeReport is return',async()=>{
            const profiler = getInstance();

            profiler.start("test");
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    return resolve();
                },1000)
            });
            const executionTimeReport = profiler.stop("test");
            expect(executionTimeReport.name).toEqual("test");
        });
        
    });
    
    describe("when the namespace of 'start' and 'stop' method not same",()=>{
        test('then throw error',async()=>{
            const profiler = getInstance();

            profiler.start('a');
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    return resolve();
                },1000)
            });

            expect(()=>profiler.stop('b')).toThrowError();
        });
    });

    describe("when options (reportHandler) pass to constructor",()=>{

        test("then reportHandler will be called when method 'stop' is called",async()=>{
            const mockFn = jest.fn();
            const profiler =  getInstance(mockFn);
    
            profiler.start("test");
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    return resolve();
                },1000)
            });
            const measureResult = profiler.stop("test");
            expect(mockFn).toBeCalled();
        });

    })

});