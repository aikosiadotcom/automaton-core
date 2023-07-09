import {describe,test,expect ,jest} from '@jest/globals';
import Environment from '#feature/environment';

describe('given Environment class',()=>{
    describe("when create object by not providing the available options",()=>{
        test('then throw error',()=>{
            expect(()=>new Environment()).toThrow();
            expect(()=>new Environment({name:"Test"})).toThrow();
            expect(()=>new Environment({value:""})).toThrow();
        })
    })

    describe("when ask to test all method",()=>{
        test('then should work as expected',()=>{
            const env = new Environment({name:'Automaton',value:'testing'});
            expect(env.isTest()).toBeTruthy();
            expect(env.isDev()).toBeFalsy();
            expect(env.isPro()).toBeFalsy();
            expect(env.get()).toBe("testing");
            expect(()=>env.root = null).toThrow();
            const newFolder = env.variable.insertTo('data','test');
            expect(newFolder).toBe(env.variable.get('test'));
            expect(()=>env.variable.insertTo('datax','test')).toThrow();
            expect(()=>env.variable.insertTo('data','data')).toThrow();
            expect(()=>env.variable.insertTo('data','test')).toThrow();
            expect(()=>env.variable.insertTo('data','//////')).toThrow();
            expect(typeof env.variable.get()).toBe("object");

            const newFile = env.variable.insertTo('data','.env',true);
            expect(newFile).toBe(env.variable.get('.env'));
        })
    })
})