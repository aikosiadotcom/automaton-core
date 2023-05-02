import {describe,test,expect ,jest} from '@jest/globals';
import FileExplorer from "#ability/file_explorer";

describe("given App class",()=>{
    describe("when NODE_ENV is set",()=>{
        test("then should get the instance",()=>{
            expect(new FileExplorer({name:'Automaton', dryRun:true}).constructor.name).toEqual("FileExplorer");
        });
    });

    describe("when additionalPath is pass with the wrong folder name",()=>{
        test("then should through error",()=>{
            expect(()=>new FileExplorer({name:'Automaton', dryRun:true, additionalPath:[{
                addToKey:'cache',
                name:"this/foldername"
            }]})).toThrow();

            expect(()=>new FileExplorer({name:'Automaton', dryRun:true, additionalPath:[{
                // @ts-ignore
                addToKey:'budi',
                name:"thisfoldername"
            }]})).toThrow();
        });
    });

    describe("when additionalPath is pass without malform",()=>{
        test("then should get the instance",()=>{

            const instance = new FileExplorer({name:'Automaton', dryRun:true, additionalPath:[{
                addToKey:'cache',
                name:"this folder name"
            }]});

            expect(instance.constructor.name).toEqual("FileExplorer");
            expect(instance.getCurrentEnv() == "Development").toBeTruthy();
            process.env.NODE_ENV = null;
            expect(()=>instance.getCurrentEnv()).toThrowError();
            process.env.NODE_ENV = "production";
            expect(instance.getCurrentEnv() == "Production").toBeTruthy();
            expect(instance.env.isDev()).toBeFalsy();
            expect(instance.env.isPro()).toBeTruthy();
        });
    });
});