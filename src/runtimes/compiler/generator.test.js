import {describe,test,expect ,jest} from '@jest/globals';
import mockAbility from "../../__mocks__/ability.js"; 
import path from "path";
import fsExtra from 'fs-extra';

const __dirname = path.join(new URL('', import.meta.url).pathname.substring(1));
const mockPath = path.join(__dirname,"..","..","..");
await mockAbility(mockPath,{showLog:false});
const Generator = (await import("./generator.js")).default;

beforeAll(()=>{
  jest.useFakeTimers();
});

describe("given Generator class",()=>{
    describe("when 'run' method is called",()=>{
        test("then the file will be compile and save to .automaton folder and the object output should have 'main' key",async()=>{
            await fsExtra.remove("C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-01\\.automaton");
            const generator = new Generator();
            const ret = await generator.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-plugin-rest-example-01',
                      root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-01',
                      file: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-01\\src\\index.js',
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
            expect(fsExtra.existsSync(ret[0].main)).toBeTruthy();
        });
    }); 

    describe("when 'run' method is called with the wrong property like rootx instead of root",()=>{
        test("then the result will 0",async()=>{
            const generator = new Generator();
            const ret = await generator.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-plugin-rest-example-02',
                      rootx: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-02',
                      file: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\__mocks__\\plugins\\@aikosia\\automaton-plugin-rest-example-02\\src\\index.js',
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
