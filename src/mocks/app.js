import EventEmitter from '#feature/event_emitter';
import FileExplorer from "#feature/file_explorer";
import {resolve} from 'import-meta-resolve';
import * as Constants from '#src/constant';

let showLog = false;
process.argv.forEach((val, index, array)=>{
    if(["--verbose"].includes(val)){
        showLog = true;
        return;
    }
});

export class App{
    event = new EventEmitter()
    profiler = {
        start:()=>"mock",
        stop:()=>"mock"
    }
    logger = {
        log:(...args)=>showLog ? console.warn(...args) : null,
        verbose:(...args)=>showLog ? console.warn(...args) : null
    }
    explorer = new FileExplorer({name:"Automaton",additionalPath:[{name:"Profile",addToKey:"data"}]})
}

export async function createMockApp(jest){
    jest.unstable_mockModule('@aikosia/automaton-core',()=>({
        App:App,
        Constants:Constants
    }));

    await import('@aikosia/automaton-core');
}

async function main(jest){
    const location = resolve('#src/app',import.meta.url);
    jest.unstable_mockModule(location.replace(process.platform == "win32" ? "file:///" : "file://",""),()=>({
        default:App
    }));
    return await import(location);
}


export default async(jest)=>await main(jest);