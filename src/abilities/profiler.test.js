import {describe,test,expect ,jest} from '@jest/globals';
import Profiler from "./profiler.js";
import Logger from './logger/logger.js';

test("should log to console",async()=>{
    const mockLog = jest.fn();
        global.console = {log:mockLog}
    const logger = new Logger();
    const profiler = new Profiler((meta)=>logger.log("info",meta));

    profiler.start("test");
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            return resolve();
        },1000)
    });
    profiler.stop("test");
    
    expect(JSON.parse(mockLog.mock.lastCall[0])).toHaveProperty("name","test"); 
});