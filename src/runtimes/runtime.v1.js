import cron from 'node-cron';
import Ability from "#src/ability";
import Compiler from '#src/runtimes/compiler/index';
import PluginLoader from '#src/runtimes/plugin_loader/index';
import parallel from "@trenskow/parallel";
import deepFreeze from "deep-freeze-es6";

class Runtime extends Ability{
    #compiler;
    #loader;

    constructor(){
        super({key:"Core",childKey:"Runtime"});
        this.#compiler = new Compiler();
        this.#loader = new PluginLoader();
    }

    async run(){ 
        this.profiler.start('Runtime.run');
        const automata = await this.#loader.ls();  
        const candidates = await this.#compiler.run({automata});
        const result = (await parallel(candidates.map(async(plugin)=>{
            return await this.#build({plugin});
        }))).filter(val=>val!=false);

        
        this.logger.log("verbose",`loaded automaton: ${result.length}`,{
            processor:'Runtime',
            active:result,
            inactive:candidates.filter((currentPlugin)=>(
                result.filter((childPlugin)=>childPlugin.name == currentPlugin.name).length == 0
            ))});

        return deepFreeze(result);
    }

    async #build({plugin}){
        const {main, name,root,file,manifest} = plugin;
        try{
            const automaton = {...plugin};

            const className = await import(`file://${main}`);

            if(className.default == undefined || className.default == null){
                throw new Error("please using \'export default\' in your class");
            }

            const _run = async ()=>{
                automaton["class"] = className.default;
                automaton["instance"] = new className.default();
                automaton["instance"].event.once('_start',()=>{});
                automaton["instance"].event.once('_end',(executionTimeReport)=>{});
                //TODO: this error not catch yet, maybe using promise?
                await automaton["instance"].event.emit("_run",manifest);
            }

            //keep alive
            if(manifest.cronjob === false || manifest.cronjob == "false"){
                    await _run();
            }else{
                //TODO: this error not catch yet, maybe using promise?
                cron.schedule(manifest.cronjob, async () =>  {
                    await _run();
                }, {
                    id:name,
                    timezone: "Asia/Jakarta"
                }); 
            }

            return automaton;
        }catch(err){
            this.logger.log("error",`RuntimeException of \'${name}\'`,err);
            return false;
        }
    }
}

export default Runtime;