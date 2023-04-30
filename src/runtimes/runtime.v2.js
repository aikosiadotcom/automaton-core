import cron from 'node-cron';
import Ability from "../ability.js";
import Compiler from '../compiler.js'
import PluginLoader from '../plugin_loader.js';
import parallel from "@trenskow/parallel";

class Runtime extends Ability{
    #compiler;
    #loader;

    constructor(){
        super({key:"Core",childKey:"Runtime"});
        this.#compiler = new Compiler();
        this.#loader = new PluginLoader();
    }

    async run({single=false}){
        this.profiler.start('Runtime.run');
        const automata = await this.#loader.ls();
        const candidates = await this.#compiler.run({automata});
        (await parallel(candidates.filter(async(plugin)=>{
            const {main, name,root,file,manifest} = plugin;
            try{
                const automaton = {...plugin};
    
                const className = await import(`file://${main}`);
    
                if(className.default == undefined || className.default == null){
                    throw new Error("please using \'export default\' in your class");
                }
    
                const _run = async ()=>{
                    automaton["class"] = className.default;
                    automaton["instance"] = className.default();
                    automaton["instance"].emitter.once('_start',()=>{});
                    automaton["instance"].emitter.once('_end',(executionTimeReport)=>{
                        if(single){
                            setTimeout(() => {
                                process.exit(0);
                            }, 2500);
                        }
                    });
                    //TODO: this error not catch yet, maybe using promise?
                    await automaton["instance"].emitter.emit("_run",manifest);
                }
    
                //keep alive
                if(userAutomatonProject || manifest.cronjob === false || manifest.cronjob == "false"){
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
            }catch(err){
                this.logger.log("error",`RuntimeException of \'${name}\'`,err);
            }
            
        }))).filter(val=>val!=false);

        this.logger.log("verbose",`loaded automaton: ${automata.length}`,automata);
        return automata;
    }
}

export default Runtime;