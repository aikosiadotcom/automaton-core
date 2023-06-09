import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app"; 
import path from "path";
import {resolve} from 'import-meta-resolve';

const mockPath = path.join(resolve("#mock",import.meta.url).replace(process.platform == "win32" ? "file:///" : "file://",""),"..");
await mockApp(jest);
const Analyzer = (await import(resolve("#compiler/analyzer",import.meta.url))).default;
// console.log(path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`));
beforeAll(()=>{
    jest.useFakeTimers();
});

describe("given Analyzer class",()=>{
    describe("when 'run' method is called",()=>{
        test("then the returned object should be immutable",async()=>{
            const analyzer = new Analyzer();
            const ret = await analyzer.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-bot-rest-example-01',
                      root: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`)
                    }
                  ]  
            }); 
            expect(ret[0]).toEqual({
                name:"@aikosia/automaton-bot-rest-example-01",
                root:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`),
                file:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`),
                manifest:{
                    "version": "1.0.0",
                    "template": "rest",
                    "profile": "default",
                    "runParameter": "page",
                    "cronjob": false
                  }});
            expect(()=>ret[0] = null).toThrow();
            expect(()=>ret[0].name = null).toThrow();
            expect(()=>ret[0].root = null).toThrow();
            expect(()=>ret[0].file = null).toThrow();
            expect(()=>ret[0].manifest = null).toThrow();
            expect(()=>ret[0].manifest.version = null).toThrow();
        });
    });
    
    describe("when 'run' method is called and root not contains automaton field in package.json",()=>{
        test("then should return 0",async()=>{
            const analyzer = new Analyzer();
            const ret = await analyzer.run({
                candidates: [
                    {
                      name: '@aikosia/automaton-bot-rest-example-02',
                      root: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-02`)
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
                      name: '@aikosia/automaton-bot-rest-example-02',
                      root: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-02`)
                    },
                    {
                        name: '@aikosia/automaton-bot-rest-example-03',
                        root: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-03`)
                    }
                  ]  
            }); 
            expect(ret).toHaveLength(0);
        });
    });
})
