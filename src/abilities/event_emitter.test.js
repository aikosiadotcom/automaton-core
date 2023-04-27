import {describe,test,expect ,jest} from '@jest/globals';
import EventEmitter from "./event_emitter.js";

let instance,mockFn;
const getInstance = ()=>new EventEmitter();

beforeEach(()=>{
    instance = getInstance();
    mockFn = jest.fn().mockImplementation((a,b = 0)=>a+b);
});

afterEach(()=>{
    jest.clearAllMocks();
});

describe('Test Method',()=>{
    test("on", ()=>{
        const tmp = instance.on("ready",()=>{});
        expect(tmp).toBe(0);
    });
    
    describe("emit",()=>{
        test("event handler exists", async()=>{
            instance.on("fire",mockFn);
            await instance.emit("fire",10);
            await instance.emit("fire",10,10);
            
            expect(mockFn.mock.results[0].value).toBe(10);
            expect(mockFn.mock.results[1].value).toBe(20);
        });
        test("event handler not exists", async()=>{
            await instance.emit("i am not exists",10);
            
            expect(1).toBe(1);
        });
    })

    describe("remove",()=>{
        test("event name not exists",async ()=>{
            expect(instance.remove("i am not exists",1)).toBeFalsy();
        });

        test("event name exists",async ()=>{
            const idEvent = instance.on("remove-me",mockFn);
            instance.remove("remove-me",idEvent);
            await instance.emit("remove-me",100);
        
            expect(mockFn.mock.results.length).toBe(0);
        });
    });
    
    test("once",async()=>{
        await instance.once("only-fire-on",mockFn);
    
        /**walaupun fire 2x, tapi mockFn hanya 1x yang dijalankan. karena once setelah fire, callback langsung dihapus*/
        await instance.emit("only-fire-on",100);
        await instance.emit("only-fire-on",500);
    
        expect(mockFn.mock.results.length).toBe(1);
    });
});
