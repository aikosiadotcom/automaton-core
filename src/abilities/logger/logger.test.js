import {describe,test,expect ,jest} from '@jest/globals';
import Logger from "./logger.js";

describe("when no supabase config",()=>{
    test("should only log to console",async()=>{
        const mockLog = jest.fn();
        global.console = {log:mockLog}
        
        const logger = new Logger();

        logger.log("info","hello world");
        expect(JSON.parse(mockLog.mock.lastCall[0])).toEqual({
            "level": "info",
            "message": "hello world",
            "module_key": "",
            "project_key": ""
        }); 
    });
});