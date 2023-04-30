import {describe,test,expect ,jest} from '@jest/globals';
import mockAbility from "../../__mocks__/ability.js"; 
import path from "path";
import { resolveDirname } from '../../system.js';

const __dirname = resolveDirname(import.meta.url);
const mockPath = path.join(__dirname,"..","..","..");
await mockAbility(mockPath,{showLog:false});
const Analyzer = (await import("./analyzer.js")).default;
// console.log(path.normalize(`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01`));
beforeAll(()=>{
    jest.useFakeTimers();
});

describe("given Analyzer class",()=>{
    describe("when 'run' method is called",()=>{
        test("then will return a immutable object",async()=>{
            const analyzer = new Analyzer();
            const ret = await analyzer.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-plugin-rest-example-01',
                      root: path.normalize(`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01`)
                    }
                  ]  
            }); 
            expect(ret[0]).toEqual({
                name:"@aikosia/automaton-plugin-rest-example-01",
                root:path.normalize(`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01`),
                file:path.normalize(`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/src\/index.js`),
                manifest:{
                    "version": "1.0.0",
                    "template": "rest",
                    "profile": "default",
                    "runParameter": "page",
                    "cronjob": false
                  }})
        });
    });
    
    describe("when 'run' method is called and root not contains automaton field in package.json",()=>{
        test("then should return 0",async()=>{
            const analyzer = new Analyzer();
            const ret = await analyzer.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-plugin-rest-example-02',
                      root: path.normalize(`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-02`)
                    }
                  ]  
            }); 
            expect(ret).toHaveLength(0);
        });
    });

    describe("when 'run' method is called and root automaton field malform in package.json",()=>{
        test("then should return 0",async()=>{
            const analyzer = new Analyzer();
            const ret = await analyzer.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-plugin-rest-example-02',
                      root: path.normalize(`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-02`)
                    },
                    {
                        name: '@aikosia/automaton-plugin-rest-example-03',
                        root: path.normalize(`${mockPath}\/__mocks__\/plugins\/@aikosia\/automaton-plugin-rest-example-03`)
                    }
                  ]  
            }); 
            expect(ret).toHaveLength(0);
        });
    });
})
