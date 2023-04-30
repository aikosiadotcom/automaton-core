import * as babel from "@babel/core";
import fsExtra from 'fs-extra';
import path from 'path';
import Ability from "#src/ability";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import parallel from "@trenskow/parallel";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

class Generator extends Ability{

    constructor(){
        super({key:"Core",childKey:"Generator"});
    }

    async run({candidates}){
        const result = (await parallel(candidates.map(async(plugin)=>{
            try{
                return {main:await this.#compile(plugin),...plugin};
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

        return result;
    }

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

        return compileFilePath;
    }
}

export default Generator;