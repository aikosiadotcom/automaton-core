import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import path from "path";
import fsExtra from 'fs-extra';
import {resolve} from 'import-meta-resolve';

const mockPath = path.join(resolve("#mock",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://",""),"..");
await mockApp({showLog:false});
const Generator = (await import(resolve("#compiler/generator",import.meta.url))).default;

beforeAll(()=>{
  jest.useFakeTimers();
});

describe("given Generator class",()=>{
    describe("when 'run' method is called",()=>{
        test("then the file will be compile and save to .automaton folder and the returned object should immutable",async()=>{
            await fsExtra.remove(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/.automaton`);//TODO: i think this line should be remove. so it dont interfere with other running test
            const generator = new Generator();
            const ret = await generator.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-bot-rest-example-01',
                      root: `${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`,
                      file: `${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`,
                      manifest: {
                        version: '1.0.0',
                        template: 'rest',
                        profile: 'default',
                        runParameter: 'page',
                        cronjob: false
                      }
                    }
                  ]
            });
            expect(ret[0]).toHaveProperty("main");
            expect(()=>ret[0]=null).toThrow();
            expect(()=>ret[0].name = null).toThrow();
            expect(()=>ret[0].root = null).toThrow();
            expect(()=>ret[0].file = null).toThrow();
            expect(()=>ret[0].manifest = null).toThrow();
            expect(()=>ret[0].manifest.version = null).toThrow();
            expect(()=>ret[0].main = null).toThrow();
            expect(()=>ret[0].instance = null).toThrow();
            expect(()=>ret[0].module = null).toThrow();
            expect(()=>ret[0].module.default = null).toThrow();
            expect(()=>ret[0].module.TestImmutability = null).toThrow();
            expect(fsExtra.existsSync(ret[0].main)).toBeTruthy();
        });
    }); 

    describe("when 'run' method is called with the wrong property like rootx instead of root",()=>{
        test("then the result will 0",async()=>{
            const generator = new Generator();
            const ret = await generator.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-bot-rest-example-02',
                      rootx: `${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-02`,
                      file: `${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-02\/src\/index.js`,
                      manifest: {
                        version: '1.0.0',
                        template: 'rest',
                        profile: 'default',
                        runParameter: 'page',
                        cronjob: false
                      }
                    }
                  ]
            });
            expect(ret).toHaveLength(0);
        });
    }); 
})
