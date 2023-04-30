import {describe,test,expect ,jest} from '@jest/globals';
import mockAbility from "../__mocks__/ability.js"; 
import mockLoader from "../__mocks__/plugin_loader.js"; 
import path from "path";

const __dirname = new URL('', import.meta.url).pathname.substring(1);
const mockPath = path.join(__dirname,"..","..");
await mockAbility(mockPath,{showLog:false});
await mockLoader(mockPath);
const Runtime = (await import("./runtime.v1.js")).default;

beforeAll(()=>{
    jest.useFakeTimers(); 
});

describe("given Runtime class",()=>{
    describe("when 'run' method is called",()=>{
        test("then will return a immutable object",async()=>{
            const runtime = new Runtime();
            const ret = await runtime.run(); 
            expect(ret.length).toEqual(1);  
            expect(()=>ret[0] = null).toThrow();
            expect(()=>ret[0].main = null).toThrow();
            expect(ret[0]).toHaveProperty("class");
            expect(ret[0]).toHaveProperty("instance");
        });
    });
})
