import path from 'path';
import App from "#src/app";
import {readPackage} from 'read-pkg';
import ManifestError from '#error/manifest_error';
import parallel from "@trenskow/parallel";
import deepFreeze from "deep-freeze-es6";
import Manifest from "#runtime/manifest";
import fsExtra from 'fs-extra';

/**
 * @typedef {object} Analyzer~AnalyzedImmutableProperties
 * @property {string} file 
 * @property {Manifest} manifest
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
 *      "cronjob": false
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
     * It will load manifest file (automaton.json) in consumer project root directory. if not found, then it will search automaton field in package.json.
     * 
     * @param {PluginLoader~LoadedImmutablePlugin} options 
     * @returns {Analyzer~AnalyzedImmutablePlugin}
     * @async
     */
    async #analysis({name,root}){
        let pkg = await readPackage({cwd:root});
        let innerManifest = pkg["automaton"];
        const file = path.join(root,pkg['main']);

        const localAutomatonConfigFilePath = path.join(root,"automaton.json");
        if(await fsExtra.exists(localAutomatonConfigFilePath)){
            /** find automaton.json and load it */
            pkg = await fsExtra.readJSON(localAutomatonConfigFilePath);
            innerManifest = pkg;
        }

        if(innerManifest == undefined || innerManifest == null || Object.keys(innerManifest).length == 0){
            throw new ManifestError({message:`${name} is not a automaton. Please using automaton field in your package.json`});
        }

        await Manifest.validate(innerManifest);

        return {
            name:name,
            root:root,
            file:file,
            manifest:new Manifest(innerManifest)
        };
    }
}

export default Analyzer;