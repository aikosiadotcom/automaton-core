import {describe,test,expect ,jest} from '@jest/globals';
import Profiler from "./profiler.js";

const getInstance = (args)=>new Profiler(args);

describe("instantiation",()=>{
    describe("no parameter given",()=>{
        test('with namespace',async()=>{
            const profiler = getInstance();

            profiler.start("test");
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    return resolve();
                },1000)
            });
            const measureResult = profiler.stop("test");
            expect(measureResult.name).toEqual("test");
        });
        
        test('no namespace',async()=>{
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
        
        test('namespace not match',async()=>{
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

    test("with parameter loginstance",async()=>{
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
});