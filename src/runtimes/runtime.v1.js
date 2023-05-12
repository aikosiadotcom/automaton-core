import cron from 'node-cron';
import App from "#src/app";
import Compiler from '#compiler/index';
import PluginLoader from '#bot_loader/index';
import parallel from "@trenskow/parallel";
import {PROJECT_BOT_INCLUDE, PROJECT_BOT_EXCLUDE} from "#src/constant";
import NpmPackageManager from '#bot_loader/npm_package_manager';
import InterfacePackageManager from '#bot_loader/interface_package_manager';
import Manifest from "#runtime/manifest";
import extend from "extend";
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
     * @param {string} [options.endpoint=""]
    */
    constructor(options){
        options = extend(true,{
            includeRegex:PROJECT_BOT_INCLUDE,
            excludeRegex:PROJECT_BOT_EXCLUDE,
            packageManager:new NpmPackageManager(),
            endpoint:""
        },options);
        super({key:"Core",childKey:"Runtime"});
        this.options = options;
        this.#compiler = new Compiler();
        this.#loader = new PluginLoader(options);
        this.automata = [];
    }

    /**
     * Run the runtime
     */
    async run(){ 
        await this.stop();
        this.profiler.start('run');
        const {candidates:automata} = await this.#loader.ls();  
        const candidates = await this.#compiler.run({automata});
        this.automata = candidates;
        await parallel(candidates.map(async(plugin)=>{
            return await this.#build({plugin});
        }));
        this.profiler.stop('run');
    }

    async reload(){
        return await this.run();
    }

    async stop(){
        for (let [key, value] of Runtime.tasks) {
            value.stop();
        }
    }

    /**
     * 
     * @param {object} options 
     * @param {Generator~GeneratedImmutablePlugin} options.plugin
     */
    async #build({plugin}){
        try{
            await this.#cronjob({plugin});
        }catch(err){
            this.logger.log("error",`Runtime Exception of \'${plugin.name}\'`,err);
            await this.event.emit("error",err,plugin);
        }
    }

    /**
     * 
     * @param {object} options 
     * @param {Generator~GeneratedImmutablePlugin} options.plugin
     */
    #cronjob({plugin}){
        const {main, name,root,file,manifest, instance, module} = plugin
        return new Promise((resolve,reject)=>{
            cron.schedule(manifest.cronjob === false ? "0 0 31 2 0" : manifest.cronjob, async () =>  {
                try{
                    await instance.event.on("error",async (err)=>{
                        await this.event.emit(`error`,err,plugin);
                    });
                    await instance.event.emit("#run",{manifest,endpoint:this.options.endpoint});
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