import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import path from "path";
import {resolve} from 'import-meta-resolve';

const mockPath = path.join(resolve("#mock",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://",""),"..");
await mockApp({showLog:false});
const Compiler = (await import(resolve("#compiler/index",import.meta.url))).default;

beforeAll(()=>{
    jest.useFakeTimers();
});

describe("given Compiler class",()=>{
    describe("when 'run' method is called",()=>{
        test("then will be process by analyzer -> generator and then output a immutable object",async()=>{
            const compiler = new Compiler();
            const ret = await compiler.run({
                automata: [
                    {
                      name: '@aikosia/automaton-bot-rest-example-01',
                      root: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`),
                      file: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`),
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
            expect(ret[0].name).toEqual("@aikosia/automaton-bot-rest-example-01");
            expect(ret[0].root).toEqual(path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`));
            expect(ret[0].file).toEqual(path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`));
            expect(ret[0].manifest).toEqual({
              "version": "1.0.0",
              "template": "rest",
              "profile": "default",
              "runParameter": "page",
              "cronjob": false
            });
            expect(ret[0].main).toEqual(path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/.automaton\/index.mjs`));
            expect(ret[0]).toHaveProperty("module");
            expect(ret[0]).toHaveProperty("instance");
           
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
        });
    }); 
})
