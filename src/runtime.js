import cron from 'node-cron';
import * as babel from "@babel/core";
import fsExtra from 'fs-extra';
import path from 'path';
import Ability from "./ability.js";
import {readPackage} from 'read-pkg';
import { execSync }  from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jsv from "json-validator";
import ManifestError from './error/manifest_error.js';
import { AUTOMATON_IGNORED_PROJECT_LIST } from './constanta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const automatonSchema = {
    version: {
      required: true,
      trim:true,
      enum: ['1.0.0']
    },
    template:{
        required:true,
        trim:true,
        enum: ["rest", "crawler", "etl"]
    },
    cronjob: {
      required: true,
      trim: true,
      asyncValidate: function(value, path, cb) {
        if(value === "false"){
            cb(null,null);
        }else{
            if(!cron.validate(value)){
                cb({message:`wrong syntax of ${path} field. Please read: https://www.npmjs.com/package/node-cron`});
            }
        }
      }
    },  
    runParameter: {
      required: true,
      trim:true,
      enum: ['context', 'page', 'null']
    },
    profile: {
        required: true,
        trim:true
    }
}

class Runtime extends Ability{
    constructor(){
        super({key:"Runtime"});
    }

    async #transform(pluginPath){
        const pkg = await readPackage({cwd:pluginPath});
        const filePath = path.join(pluginPath,pkg['main']);
        const val = pluginPath.split(path.sep).pop();
        if(pkg["automaton"] == undefined || pkg["automaton"] == null){
            throw new ManifestError({message:`${val} is not a automaton. Please using automaton field in your package.json`});
        }

        await new Promise((resolve,reject)=>{
            jsv.validate(pkg["automaton"],automatonSchema,(err,msg)=>{
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
            id:val,
            rootPath:pluginPath,
            absPath:filePath,
            manifest:pkg["automaton"]
        };
    }

    async getAutomata(userAutomatonProject = null){
        if(userAutomatonProject){
            const tmp = await this.#transform(userAutomatonProject);
            return tmp == false ? [] : [tmp];
        }

        const absPath = await Runtime.getGlobalInstalledNpmPackagesAbsPath();
        const all = await Runtime.getInstalledAutomata() ;
        this.logger.log("info","automata",all);
        const lists = all["active"];
        
        const automata = [];
        for(let i=0;i<lists.length;i++){
            const val = lists[i];
            const pluginPath = path.join(absPath,val);
            const ret = await this.#transform(pluginPath);
            if(ret){
                automata.push(ret);
            }
        }

        return automata;
    }

    //TODO: jadikan ignoreProjectList bisa di set dari server lain
    static async getInstalledAutomata(){
        const ignoreProjectList = AUTOMATON_IGNORED_PROJECT_LIST; //please using fullname. example: '@aikosia/automaton-boilerplate'

        const ret = execSync(`npm ls -g --depth=0 --json=true`);
        const list = JSON.parse(ret.toString())["dependencies"];
        let automata = [];

        //TODO: Ini bisa diubah agar jangan di hardcode
        for(let [key,value] of Object.entries(list)){
            if(key.startsWith("@aikosia")){
                if(key.split("/")[1].startsWith("automaton-")){
                    automata.push(key);
                }
            }
        }

        //ignore project filtered
        automata = automata.filter(val => !ignoreProjectList.includes(val) );

        return {installed:list,ignored:ignoreProjectList,active:automata};
    }

    static async getGlobalInstalledNpmPackagesAbsPath(){
        const absPath = execSync(`npm root -g`).toString().replace("\n","");
        return absPath;
    }

    async compile({absPath:absFilepath,writeToFile = true,rootPath}){
        const {code} = await babel.transformFileAsync(absFilepath, {
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
        });

        if(!writeToFile){
            return code;
        }

        /**convert filename to mjs, agar tidak keluar error This file is being treated as an ES module because it has a '.js' file extension*/
        let filenameToMjs = (path.basename(absFilepath)).split(".");
        filenameToMjs.pop();
        filenameToMjs.push("mjs");
        filenameToMjs = filenameToMjs.join(".");
        const compileFilePath = path.join(rootPath,".automaton",`${filenameToMjs}`);
        await fsExtra.ensureFile(compileFilePath);
        await fsExtra.writeFile(compileFilePath,code);

        return compileFilePath;
    }

    /**
     * 
     * @param {*} userAutomatonProject path to the automaton project
     * 
     * if defined, then will enter developer mode where:
     * 1. package.json automaton->cronjob will be ignored or always false
     * 2. call process.exit when automaton emit end event
     */
    async run(userAutomatonProject = null){
        const automata = await this.getAutomata(userAutomatonProject);
        this.logger.log("info","Loaded Automaton",automata);
        for(let i=0;i<automata.length;i++){
            await this.emitter.emit("validator",automata);
            
            const compileFilePath = await this.compile(automata[i]);

            const className = await import(`file:${path.sep}${path.sep}${compileFilePath}`);

            if(className.default == undefined || className.default == null){
                this.logger.log("error",automata[i].id,"please using \'export default\' in your class");
                continue;
            }

            automata[i].class = className.default;

            const _run = ()=>{
                automata[i].instance = new automata[i].class();
                automata[i].instance.emitter.once('_start',()=>{});
                automata[i].instance.emitter.once('_end',(profilerResult)=>{
                    if(userAutomatonProject){
                        setTimeout(() => {
                            process.exit(0);
                        }, 1000);
                    }
                });
                automata[i].instance.emitter.emit("_setManifest",automata[i].manifest);
            }
            //keep alive
            if(userAutomatonProject || automata[i].manifest.cronjob === false || automata[i].manifest.cronjob == "false"){
                 _run();
            }else{
                cron.schedule(automata[i].manifest.cronjob, () =>  {
                    _run();
                }, {
                    id:automata[i].id,
                    timezone: "Asia/Jakarta"
                    });
            }
        
        }

        return automata;
    }
}

export default Runtime;