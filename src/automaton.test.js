import {describe,test,expect ,jest} from '@jest/globals';

await import('./__mocks__/ability.js'); 
const getInstance = async(args)=>new (await import('./automaton.js')).default(args);
const Automaton = (await import("./automaton.js")).default;
class Bot extends Automaton{
    constructor(config){
        super(config);
    }
}

beforeEach(()=>{
    jest.resetModules();
    jest.resetAllMocks();
});

describe('instantiation', () => {
    test('should throw AbstractClassError when no params pass to constructor', async () => {
        try{
            await getInstance({key:"test",childKey:"test"});
        }catch(err){ 
            expect(err.constructor.name).toEqual("AbstractClassError");
        }
    });

    test('a', async () => {
        const bot = new Bot({key:"Bot"}); 
        expect(bot.event.once).toHaveBeenCalled();
    });
});