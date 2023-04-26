import {describe,test,expect ,jest} from '@jest/globals';
import Ability from "./ability.js";
import AbstractClassError from './error/abstract_class_error.js';
import EnvRequiredError from './error/env_required_error.js';

class DummyClass extends Ability{
    constructor(config){
        super(config)
    }
}

const env = process.env;

beforeEach(() => {
    jest.resetModules()
    process.env = {...env,
        NODE_ENV:'development',
        AUTOMATON_SUPABASE_URL: 'http://supabase.com',
        AUTOMATON_SUPABASE_KEY: 'test'
    };
});

afterEach(() => {
    process.env = env;
});

test("should throw env required error",()=>{
    expect(()=>new DummyClass({key:"test"})).toBeTruthy();
});