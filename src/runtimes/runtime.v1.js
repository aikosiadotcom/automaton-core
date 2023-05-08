import cron from 'node-cron';
import App from "#src/app";
import Compiler from '#compiler/index';
import PluginLoader from '#bot_loader/index';
import parallel from "@trenskow/parallel";
import {PROJECT_BOT_INCLUDE, PROJECT_BOT_EXCLUDE} from "#src/constant";
import NpmPackageManager from '#bot_loader/npm_package_manager';
import InterfacePackageManager from '#bot_loader/interface_package_manager';
import Manifest from "#runtime/manifest";

/**
 * The Map object is a simple key/value map. Any value (both objects and primitive values) may be used as either a key or a value.
 * @external Map
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 */

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
 *  "@aikosia/automaton-bot-rest-example-01": {},
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
     * Get the Manifest class
     * @type {Manifest}
     */
    static get Manifest(){
        return Manifest;
    }

    /**
     * Get the InterfacePackageManager class
     * @type {InterfacePackageManager}
     */
    static get InterfacePackageManager(){
        return InterfacePackageManager;
    }

    /**
     * Get the running tasks
     * @type {Map}
     */
    static get tasks(){
        return cron.getTasks();
    }

    /**
     * Get Package Manager Provider
     * 
     * @param {string} key 
     * @returns {InterfacePackageManager}
     */
    static getPackageManager(key = "npm"){
        if(key == "npm"){
            return new NpmPackageManager();
        }
    }

    /**
     * @param {object} [options] options
     * @param {string[]} [options.includeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to include
     * @param {string[]} [options.excludeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to exclude
     * @param {InterfacePackageManager} [options.packageManager={@link NpmPackageManager}]
    */
    constructor({includeRegex = PROJECT_BOT_INCLUDE, excludeRegex = PROJECT_BOT_EXCLUDE, packageManager = new NpmPackageManager()}){
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
     * @param {object} options 
     * @param {Generator~GeneratedImmutablePlugin} plugin
     */
    async #build({plugin}){
        try{
            await this.#cronjob({plugin});
        }catch(err){
            this.logger.log("error",`Runtime Exception of \'${plugin.name}\'`,err);
        }
    }

    /**
     * 
     * @param {object} options 
     * @param {Generator~GeneratedImmutablePlugin} plugin
     */
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

    /**
     * 
     * @param {boolean} value 
     * @returns {boolean}
     */
    /* c8 ignore start*/
    _getRunOnInit(value){
        return (value === false || process.env.AUTOMATON_RUNTIME_SCHEDULE_TASK_RUN_IMMEDIATELY === "yes") ? true : false;
    }
    /* c8 ignore end*/
}

export default Runtime;