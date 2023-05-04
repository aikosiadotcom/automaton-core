import cron from 'node-cron';
import App from "#src/app";
import Compiler from '#compiler/index';
import PluginLoader from '#plugin_loader/index';
import parallel from "@trenskow/parallel";
import deepFreeze from "deep-freeze-es6";
import {PLUGIN_INCLUDE_REGEX, PLUGIN_EXCLUDE_REGEX} from "#src/constant";
import NpmPackageManager from '#plugin_loader/npm_package_manager';

/**
 * Using {@link PluginLoader} to load plugins and then using {@link Compiler} to compile it
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
 * const result = await runtime.run();
 * console.log(result);
 * 
 * Console Terminal Output:
 * {
 *  name:"@aikosia/automaton-plugin-rest-example-01",
 *  root:path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01`),
 *  file:path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/src\/index.js`),
 *  manifest:{
 *      "version": "1.0.0",
 *      "template": "rest",
 *      "profile": "default",
 *      "runParameter": "page",
 *      "cronjob": "false"
 *  },
 *  main: path.normalize(`${mockPath}\/mocks\/plugins\/@aikosia\/automaton-plugin-rest-example-01\/.automaton\/index.mjs`,
 *  module: [Module: null prototype] {...object}
 *  instance: ClassName {...object}
 * }
 * 
 * @category API 
 * @extends App
*/
class Runtime extends App{
    #compiler;
    #loader;

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
     * 
     * @returns {Promise<Array<Generator~GeneratedImmutablePlugin>>}
     */
    async run(){ 
        this.profiler.start('Runtime.run');
        const {candidates:automata} = await this.#loader.ls();  
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

    /**
     * 
     */
    async #build({plugin}){
        const {main, name,root,file,manifest, instance, module} = plugin;
        try{
            //keep alive
            if(manifest.cronjob === false || manifest.cronjob == "false"){
                await instance.event.emit("#run",manifest);
            }else{
                /* c8 ignore start*/
                //TODO: this error not catch yet, maybe using promise?
                cron.schedule(manifest.cronjob, async () =>  {
                    await instance.event.emit("#run",manifest);
                }, {
                    id:name,
                    timezone: "Asia/Jakarta"
                }); 
                /* c8 ignore end*/
            }

            return plugin;
        }catch(err){
            this.logger.log("error",`RuntimeException of \'${name}\'`,err);
            return false;
        }
    }
}

export default Runtime;