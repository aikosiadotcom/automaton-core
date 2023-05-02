import {describe,test,expect ,jest} from '@jest/globals';
import {dotenv,envChecker,supabase} from "./mocks/app_deps.js";
import {resolve} from 'import-meta-resolve';

const getInstance = async(args)=>new (await import(resolve('#src/app',import.meta.url))).default(args);

beforeEach(()=>{
    jest.resetModules();
    jest.resetAllMocks();
});
  
describe("given App class", () => {

    describe("when there's no options pass to constructor", ()=>{

        test('then throw ConstructorParamsRequiredError', async () => {
            try{
                await getInstance();
                expect(1).toBe(2);
            }catch(err){ 
                expect(err.constructor.name).toEqual("ConstructorParamsRequiredError");
            }
        });   

    });

    describe("when the required options (key,childkey) provided. but, required .env file not found",()=>{
        
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

    describe("when the required options (key,childkey) provided and required .env file found too", ()=>{

        test('then should get the instance', async () => {
            await dotenv();
            await envChecker({throwError:false});
            await supabase();
            const instance = await getInstance({key:'key',childKey:'childKey'});
            expect(instance.constructor.name).toBe("App");
        });
        
    });
});