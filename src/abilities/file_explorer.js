import envPaths from "env-paths";
import path from "path";
import fsExtra from 'fs-extra';
import deepFreeze from "deep-freeze-es6";
import {isValidPath} from "@igor.dvlpr/valid-path";

/** 
 * The FileExplorer class creates an instance with customizable paths and options for a given name, additional paths, and dry run mode. 
*/
class FileExplorer{
    /**  
     * @typedef {object} Path
     * @property {'data' | 'config' | 'cache' | 'log' | 'temp'} addToKey 
     * @property {string} name 
    */

    /**
     * Creates an instance of App.
     * @param {object} options
     * @param {string} options.name 
     * @param {Path[]} [options.additionalPath=[]]
     * @param {boolean} [options.dryRun=false]
     */
    constructor({name, additionalPath = [], dryRun = false}){
        
        this.dryRun = dryRun;

        this.path = envPaths(path.join(name,this.getCurrentEnv()), {
            suffix:"",
        });

        additionalPath.forEach((val)=>{
            if(!isValidPath(val.name,false)){
                throw new Error(`'${val.name}' is not a valid directory name.`);
            }

            if(!['data','config','cache','log','temp'].includes(val.addToKey)){
                throw new Error(`'${val.addToKey}' not valid.`);
            }

            this.path[val.name.toLowerCase().replaceAll(" ","_")] = path.join(this.path[val.addToKey],val.name);
        });

        if(dryRun){
            // @ts-ignore
            for(let [key,value] of Object.entries(this.path)){
                fsExtra.ensureDirSync(value);
            }
        }

        /** .env file */
        // @ts-ignore
        this.path.env = path.join(this.path.config,".env");
        // @ts-ignore
        fsExtra.ensureFileSync(this.path.env);

        this.env = {
            isDev:()=>process.env.NODE_ENV === 'development',
            isPro:()=>process.env.NODE_ENV === 'production'
        }

        deepFreeze(this);
    }

    getCurrentEnv(){
        if(process.env.NODE_ENV == 'development'){
            return 'Development';
        }else if(process.env.NODE_ENV == 'production'){
            return 'Production';
        }
    
        throw new Error(`Unknown ${process.env.NODE_ENV} Environment. Please choose between 'production' or 'development' `);
    }
}

export default FileExplorer