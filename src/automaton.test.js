import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app";
import {resolve} from 'import-meta-resolve';

await mockApp({showLog:false});
await import(resolve('#mock/axios',import.meta.url)); 
await import(resolve('#mock/playwright-core',import.meta.url)); 
const Automaton = (await import(resolve("#src/automaton",import.meta.url))).default;
class Bot extends Automaton{
    constructor(config){
        super(config);
    }
}

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