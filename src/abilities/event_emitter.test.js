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

describe("given EventEmitter class",()=>{

    describe("when register a event using 'on' method",()=>{
        test("then a number identifier will be return", ()=>{
            const tmp = instance.on("ready",()=>{});
            expect(tmp).toBe(0);
        });
    })

    describe("when 'emit' method is called on conditions",()=>{

        describe("1. there's a registered event handler",()=>{

            test("then the registered event handler will be executed", async()=>{

                instance.on("fire",mockFn);
                await instance.emit("fire",10);
                await instance.emit("fire",10,10);
                
                expect(mockFn.mock.results[0].value).toBe(10);
                expect(mockFn.mock.results[1].value).toBe(20);
    
            });

        });
            
        describe("2. no registered event handler",()=>{

            test("then nothing will happen", async()=>{

                await instance.emit("i am not exists",10);
                
                expect(1).toBe(1);

            });
        });


    })
    
    describe("when 'remove' method is called on conditions",()=>{

        describe("1. event name 'or' event handler id not exists", ()=>{
            
            test("then nothing will happen",async ()=>{

                expect(instance.remove("i am not exists",1)).toBeFalsy();

            });
        });

        describe("2. event name 'and' event handler id exists", ()=>{

            test("then the registered event handler should be removed",async ()=>{
                const idEvent = instance.on("remove-me",mockFn);
                instance.remove("remove-me",idEvent);
                await instance.emit("remove-me",100);
            
                expect(mockFn.mock.results.length).toBe(0);
            });

        });

    });

    describe("when 'once' method is called",()=>{

        test("then the event handler will be removed after the first emit",async()=>{

            await instance.once("only-fire-on",mockFn);
        
            /**walaupun fire 2x, tapi mockFn hanya 1x yang dijalankan. karena once setelah fire, callback langsung dihapus*/
            await instance.emit("only-fire-on",100);
            await instance.emit("only-fire-on",500);
        
            expect(mockFn.mock.results.length).toBe(1);

        });
    })
    
});
