import {jest} from '@jest/globals';
import EventEmitter from '../abilities/event_emitter.js';
import path from "path";

async function main(currentDir, {showLog = false}){
    const location = path.join(currentDir,"ability.js");
    jest.unstable_mockModule(location,()=>({
        default:class Ability{
            event = new EventEmitter()
            profiler = {
                start:()=>"mock",
                stop:()=>"mock"
            }
            logger = {
                log:(...args)=>showLog ? console.warn(...args) : null,
                verbose:(...args)=>showLog ? console.warn(...args) : null
            }
        }
    }));
    await import(location);
}


export default async(currentDir,opts)=>main(currentDir,opts);