import {describe,test,expect ,jest} from '@jest/globals';
import env from '#feature/env';

describe('given env object',()=>{
    describe('when process.env changes',()=>{
        test('should reflect',()=>{
            process.env.NODE_ENV = 'testing';
            expect(env.isTest()).toBeTruthy();
            expect(env.getCapitalize()).toBe("Testing");
            process.env.NODE_ENV = 'development';
            expect(env.isDev()).toBeTruthy();
            expect(env.getCapitalize()).toBe("Development");
            process.env.NODE_ENV = 'production';
            expect(env.isPro()).toBeTruthy();
            expect(env.getCapitalize()).toBe("Production");
            delete process.env.NODE_ENV;
            expect(()=>env.getCapitalize()).toThrow();
        })
    })
})