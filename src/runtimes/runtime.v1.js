import cron from 'node-cron';
import App from "#src/app";
import Compiler from '#compiler/index';
import PluginLoader from '#plugin_loader/index';
import parallel from "@trenskow/parallel";
import {PLUGIN_INCLUDE_REGEX, PLUGIN_EXCLUDE_REGEX} from "#src/constant";
import NpmPackageManager from '#plugin_loader/npm_package_manager';
import * as Manifest from "#runtime/manifest";

/**
 * To load plugins and run it
 * 
 * @example
 * import Runtime from "./runtime.v1.js";
 * 
 * const runtime = new Runtime({includeRegex:["@aikosia/automaton-"],packageManager:new TestPackageManager()});
 * 
 * //assume new TestPackageManager when ls is called, it will return
 * {
 *  "@aikosia/automaton-plugin-rest-example-01": {},
 * }
 * 
 * await runtime.run();
 * }
 * 
 * @category API 
 * @extends App
*/
class Runtime extends App{
    #compiler;
    #loader;
    
    /**
     * @returns {module:Manifest}
     */
    static get manifest(){
        return Manifest;
    }

    static get tasks(){
        return cron.getTasks();
    }

/**
   * @param {object} [options] options
   * @param {string[]} [options.includeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to include
   * @param {string[]} [options.excludeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to exclude
   * @param {InterfacePackageManager} [options.packageManager={@link NpmPackageManager}]
   */
    constructor({includeRegex = PLUGIN_INCLUDE_REGEX, excludeRegex = PLUGIN_EXCLUDE_REGEX, packageManager = new NpmPackageManager()}){
        super({key:"Core",childKey:"Runtime"});
        this.#compiler = new Compiler();
        this.#loader = new PluginLoader({includeRegex, excludeRegex,packageManager});
    }

    /**
     * Run the runtime
     */
    async run(){ 
        this.profiler.start('Runtime.run');
        const {candidates:automata} = await this.#loader.ls();  
        const candidates = await this.#compiler.run({automata});

        await parallel(candidates.map(async(plugin)=>{
            return await this.#build({plugin});
        }));
    }

    /**
     * 
     * @param {Generator~GeneratedImmutablePlugin} options 
     * @returns {false | Generator~GeneratedImmutablePlugin}
     */
    async #build({plugin}){
        try{
            await this.#cronjob({plugin});
        }catch(err){
            this.logger.log("error",`Runtime Exception of \'${plugin.name}\'`,err);
        }
    }

    #cronjob({plugin}){
        const {main, name,root,file,manifest, instance, module} = plugin
        return new Promise((resolve,reject)=>{
            cron.schedule(manifest.cronjob === false ? "0 0 31 2 0" : manifest.cronjob, async () =>  {
                try{
                    await instance.event.emit("#run",{manifest});
                    return resolve();
                }catch(err){
                    return reject(err);
                }
            }, {
                id:name,
                name:name,
                timezone: "Asia/Jakarta",
                runOnInit:this._getRunOnInit(manifest.cronjob),
                recoverMissedExecutions:false,
                manifest:manifest
            });
        });
    }

    /* c8 ignore start*/
    _getRunOnInit(value){
        return (value === false || process.env.AUTOMATON_RUNTIME_SCHEDULE_TASK_RUN_IMMEDIATELY === "yes") ? true : false;
    }
    /* c8 ignore end*/
}

export default Runtime;