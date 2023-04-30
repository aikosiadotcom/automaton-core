import {describe,test,expect ,jest} from '@jest/globals';
import mockAbility from "../../__mocks__/ability.js"; 
import path from "path";
import { resolveDirname } from '../../system.js';

const __dirname = resolveDirname(import.meta.url);
const mockPath = path.join(__dirname,"..","..","..");
await mockAbility(mockPath,{showLog:false});
const Compiler = (await import("./index.js")).default;

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
                      root: `${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01`,
                      file: `${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/src\/index.js`,
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
                root:`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01`,
                file:`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/src\/index.js`,
                manifest:{
                    "version": "1.0.0",
                    "template": "rest",
                    "profile": "default",
                    "runParameter": "page",
                    "cronjob": false
                  },
                main: `${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/.automaton\/index.mjs`})
        });
    }); 
})
