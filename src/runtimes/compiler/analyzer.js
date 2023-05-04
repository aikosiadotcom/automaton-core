import path from 'path';
import App from "#src/app";
import {readPackage} from 'read-pkg';
import jsv from "json-validator";
import ManifestError from '#error/manifest_error';
import parallel from "@trenskow/parallel";
import deepFreeze from "deep-freeze-es6";
import * as manifest from "#runtime/manifest";

/**
 * @typedef {object} Analyzer~AnalyzedImmutableProperties
 * @property {string} file 
 * @property {module:Manifest~Schema} manifest
 */

/**
 * @typedef {PluginLoader~LoadedImmutablePlugin & Analyzer~AnalyzedImmutableProperties} Analyzer~AnalyzedImmutablePlugin
 */


/**
 * This class will do analysis on file manifest plugin and add some new properties
 * @category Runtimes
 * @subcategory Compiler
 * 
 * @example 
 * 
 * import Analyzer from "./analyzer.js";
 * 
 * const candidates = [{
 *      name: '@aikosia/automaton-plugin-rest-example-01',
 *      root: path.normalize(`${__dirname}\/plugins\/@aikosia\/automaton-plugin-rest-example-01`)
 * }]
 * const analyzer = new Analyzer();
 * const result = await analyzer.run({candidates});
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
 *  }
 * }
 * 
 * @extends App
 */
class Analyzer extends App{

    constructor(){
        super({key:"Core",childKey:"Analyzer"});
    }

    /**
     * Run the analysis
     * @param {object} options 
     * @param {Array<PluginLoader~LoadedImmutablePlugin>} options.candidates 
     * 
     * @returns {Promise<Array<Analyzer~AnalyzedImmutablePlugin>>}
     * 
     * @async
     */
    async run({candidates}){
        const result = (await parallel(candidates.map(async (plugin)=>{
            try{
                return await this.#analysis(plugin);
            }catch(err){
                this.logger.log("warn",`deactivation \'${plugin.name}\'`,err);
                return false;
            }
        }))).filter(val=>val!==false);

        const inactive = candidates.filter((currentPlugin)=>(
            result.filter((childPlugin)=>childPlugin.name == currentPlugin.name).length == 0
        ));

        this.logger.log("verbose",`passed: ${result.length}`,{
            processor:'Analyzer',
            candidates:result,
            inactive:inactive});

        return deepFreeze(result);
    }

    /**
     * @param {PluginLoader~LoadedImmutablePlugin} options 
     * @returns {Analyzer~AnalyzedImmutablePlugin}
     * @async
     */
    async #analysis({name,root}){
        const pkg = await readPackage({cwd:root});
        const innerManifest = pkg["automaton"];
        const file = path.join(root,pkg['main']);
        if(innerManifest == undefined || innerManifest == null || Object.keys(innerManifest).length == 0){
            throw new ManifestError({message:`${name} is not a automaton. Please using automaton field in your package.json`});
        }

        await new Promise((resolve,reject)=>{
            jsv.validate(JSON.parse(JSON.stringify(innerManifest)),manifest.SCHEMA_JSON_VALIDATOR,(err,msg)=>{
                if(msg && Object.keys(msg).length){
                    return reject(new ManifestError(msg));
                }

                /* c8 ignore start */
                if(err){
                    return reject(new ManifestError(err));
                }
                /* c8 ignore end */

                return resolve();
            });
        });

        // turn off intentionally since the mock for test dont implement explorer yet
        // if(this.explorer.env.isDev()){
        //     //set default value for development
        //     config["profile"] = 'default';
        //     config["cronjob"] = false;
        // }

        return {
            name:name,
            root:root,
            file:file,
            manifest:innerManifest
        };
    }
}

export default Analyzer;