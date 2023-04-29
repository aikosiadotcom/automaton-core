import * as babel from "@babel/core";
import fsExtra from 'fs-extra';
import path from 'path';
import Ability from "./ability.js";
import {readPackage} from 'read-pkg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jsv from "json-validator";
import ManifestError from './error/manifest_error.js';
import * as constant from './constant.js/index.js';
import parallel from "@trenskow/parallel";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Analyzer extends Ability{

    constructor(){
        super({key:"Core",childKey:"Analyzer"});
    }

    async run({candidates}){
        const result = (await parallel(candidates.map(async ({plugin})=>{
            try{
                return await this.analysis({plugin});
            }catch(err){
                this.logger.log("warn",`deactivation \'${plugin.name}\'`,err);
                return false;
            }
        }))).filter(val=>val!=false);

        const inactive = candidates.filter((currentPlugin)=>(
            result.filter((childPlugin)=>childPlugin.name == currentPlugin.name).length == 0
        ));

        this.logger.log("verbose","result",{
            candidates:result,
            inactive:inactive});

        return result;
    }

    async analysis({name,root}){
        const pkg = await readPackage({cwd:pluginPath});
        const file = path.join(pluginPath,pkg['main']);
        if(pkg["automaton"] == undefined || pkg["automaton"] == null){
            throw new ManifestError({message:`${name} is not a automaton. Please using automaton field in your package.json`});
        }

        await new Promise((resolve,reject)=>{
            jsv.validate(pkg["automaton"],constant.AUTOMATON_SCHEMA,(err,msg)=>{
                if(msg && Object.keys(msg).length){
                    reject(new ManifestError(msg));
                }

                if(err){
                    reject(new ManifestError(err));
                }

                return resolve();
            });
        });

        //set default value for development
        if(process.env.NODE_ENV != 'production'){
            pkg["automaton"]["profile"] = 'default';
            pkg["automaton"]["cronjob"] = false;
        }

        return {
            name:name,
            root:root,
            file:file,
            manifest:pkg["automaton"]
        };
    }
}

class Generator extends Ability{
    #babelOptions = {
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

    constructor(){
        super({key:"Core",childKey:"Generator"});
    }

    async run(){
        const result = (await parallel(candidates.map(async({plugin})=>{
            try{
                return {main:await this.#compile(plugin),...plugin};
            }catch(err){
                this.logger.log("warn",`deactivation \'${plugin.name}\'`,err);
                return false;
            }
        }))).filter(val=>val!=false);

        this.logger.log("verbose","result",{
            candidates:result,
            inactive:candidates.filter((currentPlugin)=>(
                active.filter((childPlugin)=>childPlugin.name == currentPlugin.name).length == 0
            ))});

        return result;
    }

    async #compile({name,root,file,manifest}){
        const {code} = await babel.transformFileAsync(file, this.#babelOptions);

        /**convert filename to mjs, to fix bug error "This file is being treated as an ES module because it has a '.js' file extension"*/
        let filenameToMjs = (path.basename(file)).split(".");
        filenameToMjs.pop();
        filenameToMjs.push("mjs");
        filenameToMjs = filenameToMjs.join(".");
        const compileFilePath = path.join(root,".automaton",`${filenameToMjs}`);
        await fsExtra.ensureFile(compileFilePath);
        await fsExtra.writeFile(compileFilePath,code);

        return compileFilePath;
    }
}

class Compiler extends Ability{
    #analyzer;
    #generator;

    constructor(){
        super({key:"Core",childKey:"Compiler"});
        this.#analyzer = new Analyzer();
        this.#generator = new Generator()
    }
    
    async run({candidates}){
        const analyzerResult = await this.#analyzer.run({candidates});
        const generatorResult = await this.#generator.run({analyzerResult});

        return generatorResult;
    }
}

export default Compiler;