import path from 'path';
import App from "#src/app";
import {readPackage} from 'read-pkg';
import jsv from "json-validator";
import ManifestError from '#error/manifest_error';
import * as constant from '#src/constant';
import parallel from "@trenskow/parallel";

class Analyzer extends App{

    constructor(){
        super({key:"Core",childKey:"Analyzer"});
    }

    async run({candidates}){
        const result = (await parallel(candidates.map(async (plugin)=>{
            try{
                return await this.analysis(plugin);
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

        return result;
    }

    async analysis({name,root}){
        const pkg = await readPackage({cwd:root});
        const config = pkg["automaton"];
        const file = path.join(root,pkg['main']);
        if(config == undefined || config == null || Object.keys(config).length == 0){
            throw new ManifestError({message:`${name} is not a automaton. Please using automaton field in your package.json`});
        }

        //TODO: before call this function, cronjob data type is boolean, after jsv.validate(), cronjob data type somehow turn to string
        await new Promise((resolve,reject)=>{
            jsv.validate(config,constant.SCHEMA,(err,msg)=>{
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

        // if(!this.app.env.isProduction()){
        //     //set default value for development
        //     config["profile"] = 'default';
        //     config["cronjob"] = false;
        // }

        return {
            name:name,
            root:root,
            file:file,
            manifest:config
        };
    }
}

export default Analyzer;