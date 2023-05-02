import {jest} from '@jest/globals';
import EventEmitter from '#feature/event_emitter';
import {resolve} from 'import-meta-resolve';

async function main({showLog = false}){
    const location = resolve('#src/app',import.meta.url);
    jest.unstable_mockModule(location.replace(process.platform == "win32" ? "file:///" : "file://",""),()=>({
        default:class App{
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


export default async(opts)=>main(opts);