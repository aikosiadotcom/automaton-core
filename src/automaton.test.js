import {describe,test,expect ,jest} from '@jest/globals';
import mockAbility from "./__mocks__/ability.js";
import path from "path";
import { resolveDirname } from './system.js';

const __dirname = resolveDirname(import.meta.url);
await mockAbility(path.join(__dirname,".."),{showLog:false});
await import('./__mocks__/axios.js'); 
await import('./__mocks__/playwright-core.js'); 
const Automaton = (await import("./automaton.js")).default;
class Bot extends Automaton{
    constructor(config){
        super(config);
    }
}
const getInstance = (args)=>new Bot(args);

beforeEach(()=>{
    jest.resetModules();
    jest.resetAllMocks();
});
 
describe('given Automaton class', () => {

    describe('when no options pass to constructor',()=>{
        test('then throw AbstractClassError', async () => {
            try{
                new Automaton({key:"test",childKey:"test"});
            }catch(err){ 
                expect(err.constructor.name).toEqual("AbstractClassError");
            }
        });
    });

    describe("when the required options key is pass and emit '_run' event",()=>{
        test('then the _end event handler should be called', async () => {
            const mockFn = jest.fn();
            const bot = new Bot({key:"Bot"}); 
            bot.event.once("_end",mockFn);
            await bot.event.emit('_run',{
                "version": "1.0.0", 
                "template": "rest",
                "profile": "default",
                "runParameter": "page",
                "cronjob": false
            });
            expect(mockFn).toBeCalled();
        });
    })
 
});