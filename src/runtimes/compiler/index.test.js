import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import path from "path";
import {resolve} from 'import-meta-resolve';

const mockPath = path.join(resolve("#mock",import.meta.url).replace("file:///",""),"..");
await mockApp({showLog:false});
const Compiler = (await import(resolve("#compiler/index",import.meta.url))).default;

beforeAll(()=>{
    jest.useFakeTimers();
});

describe("given Compiler class",()=>{
    describe("when 'run' method is called",()=>{
        test("then will be process by analyzer -> generator and then output a result",async()=>{
            const compiler = new Compiler();
            const ret = await compiler.run({
                automata: [
                    {
                      name: '@aikosia/automaton-plugin-rest-example-01',
                      root: path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01`),
                      file: path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/src\/index.js`),
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
            expect(ret[0]).toEqual({
                name:"@aikosia/automaton-plugin-rest-example-01",
                root:path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01`),
                file:path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/src\/index.js`),
                manifest:{
                    "version": "1.0.0",
                    "template": "rest",
                    "profile": "default",
                    "runParameter": "page",
                    "cronjob": false
                  },
                main: path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/.automaton\/index.mjs`)
              })
        });
    }); 
})
