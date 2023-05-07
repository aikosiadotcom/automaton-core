import * as babel from "@babel/core";
import fsExtra from 'fs-extra';
import path from 'path';
import App from "#src/app";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import parallel from "@trenskow/parallel";
import deepFreeze from "deep-freeze-es6";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @constant Generator~BABEL_OPTIONS
 * @see https://babeljs.io/docs/options
 */
export const BABEL_OPTIONS = {
    cwd:__dirname,
    caller: {
        name: "automaton",
        supportsStaticESM: true,
    },
    code:true,
    ast:false,
    babelrc:false,
    presets:[["@babel/preset-env", { "modules": false }]],
    plugins:[
        ["@babel/plugin-proposal-decorators", { "version": "2023-01" }]
    ],
    targets:{
        "node": "18.12.1",
        "esmodules": true
    }
}

/**
 * @typedef {object} Generator~GeneratedImmutableProperties
 * @property {string} main - The path location of compiled file
 * @property {object} module - Compiled file will be loaded to this property using await import(file) internally. {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import}
 * @property {object} instance - This property will hold instance of exported default variable inside module using syntax new module.default(); 
 */

/**
 * @typedef {Analyzer~AnalyzedImmutablePlugin & Generator~GeneratedImmutableProperties} Generator~GeneratedImmutablePlugin
 */

/**
 * This class will compile source code of plugin using [Babel]{@link https://babeljs.io/docs/babel-core#transformfileasync} and store the compiled file into folder .automaton on top of the root directory to run it later.
 * @example
 * import Generator from "./generator.js";
 * 
 * const candidates = [{
 *  name:"@aikosia/automaton-bot-rest-example-01",
 *  root:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`),
 *  file:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`),
 *  manifest:{
 *      "version": "1.0.0",
 *      "template": "rest",
 *      "profile": "default",
 *      "runParameter": "page",
 *      "cronjob": false
 *  }
 * }]
 * const generator = new Generator();
 * const result = await generator.run({candidates});
 * console.log(result);
 * 
 * Console Terminal Output:
 * {
 *  name:"@aikosia/automaton-bot-rest-example-01",
 *  root:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`),
 *  file:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`),
 *  manifest:{
 *      "version": "1.0.0",
 *      "template": "rest",
 *      "profile": "default",
 *      "runParameter": "page",
 *      "cronjob": false
 *  },
 *  main: path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/.automaton\/index.mjs`,
 *  module: [Module: null prototype] {...object}
 *  instance: ClassName {...object}
 * }
 * 
 * @category Runtimes
 * @subcategory Compiler
 * @extends App
 */
class Generator extends App{

    constructor(){
        super({key:"Core",childKey:"Generator"});
    }

    /**
     * Run the generator
     * @param {object} options 
     * @param {Array<Analyzer~AnalyzedImmutablePlugin>} options.candidates 
     * 
     * @returns {Promise<Array<Generator~GeneratedImmutablePlugin>>}
     * 
     * @async
     */
    async run({candidates}){
        const result = (await parallel(candidates.map(async(plugin)=>{
            try{
                return {...(await this.#compile(plugin)),...plugin};
            }catch(err){
                this.logger.log("warn",`deactivation \'${plugin.name}\'`,err);
                return false;
            }
        }))).filter(val=>val!=false);

        this.logger.log("verbose",`passed: ${result.length}`,{
            processor:'Generator',
            candidates:result,
            inactive:candidates.filter((currentPlugin)=>(
                result.filter((childPlugin)=>childPlugin.name == currentPlugin.name).length == 0
            ))});

        //Fix bug: cannot redefined property: default. cause 'module' have a default property and already in freeze state. Also, instance cannot be freeze, cause EventEmitter is a mutable class
        const tmp = result.map((val)=>{
            const newValue = {};
            Object.keys(val).forEach((key)=>{
                if(key !== 'module' && key!=='instance'){
                    newValue[key] = deepFreeze(val[key]);
                }else{
                    newValue[key] = val[key]
                }
            });

            return Object.freeze(newValue);;
        });

        return Object.freeze(tmp);
    }

    /**
     * @param {Analyzer~AnalyzedImmutablePlugin} options 
     * @returns {string} Compiled file path location
     * @async
     */
    async #compile({name,root,file,manifest}){
        const {code} = await babel.transformFileAsync(file, BABEL_OPTIONS);

        /**convert filename to mjs, to fix bug error "This file is being treated as an ES module because it has a '.js' file extension"*/
        let filenameToMjs = (path.basename(file)).split(".");
        filenameToMjs.pop();
        filenameToMjs.push("mjs");
        filenameToMjs = filenameToMjs.join(".");
        const compileFilePath = path.join(root,".automaton",`${filenameToMjs}`);
        await fsExtra.ensureFile(compileFilePath);
        await fsExtra.writeFile(compileFilePath,code);

        const module = await import(`file://${compileFilePath}`);

        if(module.default == undefined || module.default == null){
            throw new Error("Class must \'export default\'");
        }

        return {main:compileFilePath,module:module, instance:new module.default()};
    }
}

export default Generator;