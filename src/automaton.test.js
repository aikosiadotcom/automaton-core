import {describe,test,expect ,jest} from '@jest/globals';
import mockApp from "#mock/app";
import {resolve} from 'import-meta-resolve';

await mockApp(jest);
await import(resolve('#mock/axios',import.meta.url)); 
await import(resolve('#mock/playwright-core',import.meta.url)); 
const Automaton = (await import(resolve("#src/automaton",import.meta.url))).default;
class Bot extends Automaton{
    constructor(config){
        super(config);
    }

    async run(page){}
}

class Bot2 extends Automaton{
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

    describe("when the required options key is pass and emit '#run' event",()=>{
        test('then the end event handler should be called', async () => {
            const mockFn = jest.fn();
            const bot = new Bot({key:"Bot"}); 
            
            bot.event.on("end",mockFn);
            await bot.event.emit('#run',{
                manifest:{
                    "version": "1.0.0", 
                    "template": "rest",
                    "profile": "default",
                    "runParameter": "page",
                    "cronjob": false
                }
            });
            expect(mockFn).toBeCalledTimes(1);

            await bot.event.emit('#run',{
                manifest:{
                    "version": "1.0.0", 
                    "template": "rest",
                    "profile": "default",
                    "runParameter": "page",
                    "cronjob": false
                },
                endpoint:"https://localhost:9999"
            });
            expect(mockFn).toBeCalledTimes(2);
        });
    });

    describe("when the bot dont implement async run method",()=>{
        test('then should throw error', async () => {
            const bot = new Bot2({key:"Bot"});
            await expect(async()=>bot.event.emit('#run')).rejects.toThrow();
        });
    });
});
 