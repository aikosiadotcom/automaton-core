import {describe,test,expect ,jest} from '@jest/globals';
import {dotenv,envChecker,supabase} from "./mocks/app_deps.js";
import {resolve} from 'import-meta-resolve';
import path from "path";

const getInstance = async(args)=>new (await import(resolve('#src/app',import.meta.url))).default(args);

beforeEach(()=>{
    jest.resetModules();
    jest.resetAllMocks();
});

  
describe("given App class", () => {

    describe("when there's no options pass to constructor", ()=>{

        test('then throw ConstructorParamsRequiredError', async () => {
            try{
                await getInstance({});
                expect(1).toBe(2);
            }catch(err){ 
                expect(err.constructor.name).toEqual("ConstructorParamsRequiredError");
            }
        });   

    });

    describe("when the required options (key,childkey) provided and required .env file found on local path (project root directory)", ()=>{
        test('then should get the instance', async () => {
            process.chdir(path.join("src","mocks","plugins","@aikosia","automaton-plugin-rest-example-05"));
            await supabase();
            const instance = await getInstance({key:'key',childKey:'childKey'});
            expect(instance.constructor.name).toBe("App");

            /**careful this block maybe FAIL cause process.env is global object and jest test run parallel*/
            expect(process.env.AUTOMATON_DAEMON_HOST).toEqual("test");
            expect(process.env.AUTOMATON_DAEMON_PORT).toEqual("test");
            expect(process.env.AUTOMATON_SUPABASE_URL).toEqual("test");
            expect(process.env.AUTOMATON_SUPABASE_KEY).toEqual("test");
        });
        
    });

    describe("when the required options (key,childkey) provided. but, required .env file found on system path with the wrong variable",()=>{
        
        beforeEach(()=>{
            //needed because EnvRequiredError will console.error
            // jest.spyOn(console, 'error').mockImplementation(() => {}); 
        })

        test('then throw EnvRequiredError',  async() => {
            try{
                (await import(resolve("#mock/node-envchecker",import.meta.url))).default({throwError:true})
                await getInstance({key:'key',childKey:'childKey'});
                expect(1).toBe(2);
            }catch(err){
                expect(err.constructor.name).toEqual("EnvRequiredError");
            }
        });
    });

    describe("when the required options (key,childkey) provided and required .env file found on system path with the right variable", ()=>{

        test('then should get the instance', async () => {
            await dotenv();
            await envChecker({throwError:false});
            await supabase();
            const instance = await getInstance({key:'key',childKey:'childKey'});
            expect(instance.constructor.name).toBe("App");
        });
        
    });

    
    // describe("when _getEnvFile is called", ()=>{

    //     test('then should function as it should be', async () => {
    //         await dotenv();
    //         await envChecker({throwError:false});
    //         await supabase();
    //         const instance = await getInstance({key:'key',childKey:'childKey'});
    //         instance._getEnvFile();
    //         expect(1).toBe(1);

    //         process.chdir(path.join("src","mocks","plugins","@aikosia","automaton-plugin-rest-example-05"));
    //         instance._getEnvFile();
    //         expect(1).toBe(1);
    //     });
        
    // });
});