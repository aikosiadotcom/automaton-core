import {describe,test,expect ,jest} from '@jest/globals';
import {dotenv,envChecker,supabase} from "./__mocks__/abilitity_deps.js";

jest.unstable_mockModule("./abilities/profiler.js",()=>({
    default:jest.fn()
}));

// const dotenv = async()=>(await import("./__mocks__/dotenv.js")).default;
// const envChecker = async()=>(await import("./__mocks__/node-envchecker.js")).default;
// const supabase = async()=>(await import("./__mocks__/supabase.js")).supabase_;
const profiler = async()=>(await import("./abilities/profiler.js")).default;
const getInstance = async(args)=>new (await import('./ability.js')).default(args);

beforeEach(()=>{
    jest.resetModules();
    jest.resetAllMocks();
});

describe('instantiation', () => {

    test('should throw ConstructorParamsRequiredError when no params pass to constructor', async () => {
        try{
            await getInstance();
        }catch(err){
            expect(err.constructor.name).toEqual("ConstructorParamsRequiredError");
        }
    });
    
    test('should throw EnvRequiredError when there\'s no env variables',  async() => {
        try{
            await getInstance({key:'key',childKey:'childKey'});
        }catch(err){
            expect(err.constructor.name).toEqual("EnvRequiredError");
        }
    });

    test('passing only required params', async () => {
        await dotenv();
        await envChecker();
        const t = await supabase();
        const instance = await getInstance({key:'key',childKey:'childKey'});
        expect(instance.constructor.name).toBe("Ability");
    });
    
    test('passing all params', async () => {
        await dotenv();
        await envChecker();
        await supabase();
        const mock = await profiler();
        const instance = await getInstance({
            key:'key',
            childKey:'childKey',
            supabase:{
                url:null,
                secret:null
            },
            winston:{
                level:'debug',
                defaultMeta:{
                    projectKey:null,
                    moduleKey:null,
                    childModuleKey:null
                }
            },
            logger:{
                console:true
            }
        });
        expect(instance.constructor.name).toBe("Ability");
        expect(mock).toHaveBeenCalled();
    });
});