import {describe,test,expect ,jest} from '@jest/globals';
import EventEmitter from "./event_emitter.js";

class MyClass extends EventEmitter{}

let instance = null;
const mockFn = jest.fn().mockImplementation((arg1,arg2 = 0)=>0 + arg1 + arg2);

beforeEach(()=>{
    instance = new MyClass();
});

afterEach(() => {
    mockFn.mockClear();
});

test("on", ()=>{
    const tmp = instance.on("ready",mockFn);
    expect(tmp).toBe(0);
});

test("emit", async()=>{
    const tmp = instance.on("fire",mockFn);
    await instance.emit("fire",10);
    await instance.emit("fire",10,10);
    
    expect(mockFn.mock.results[0].value).toBe(10);
    expect(mockFn.mock.results[1].value).toBe(20);
});

test("remove",async ()=>{
    const idEvent = instance.on("remove-me",mockFn);
    instance.remove("remove-me",idEvent);
    await instance.emit("remove-me",100);

    expect(mockFn.mock.results.length).toBe(0);
});

test("once",async()=>{
    await instance.once("only-fire-on",mockFn);

    /**walaupun fire 2x, tapi mockFn hanya 1x yang dijalankan. karena once setelah fire, callback langsung dihapus*/
    await instance.emit("only-fire-on",100);
    await instance.emit("only-fire-on",500);

    expect(mockFn.mock.results.length).toBe(1);
});