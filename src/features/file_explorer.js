import envPaths from "env-paths";
import path from "path";
import fsExtra from 'fs-extra';
import {isValidPath} from "@igor.dvlpr/valid-path";
import env from "#feature/env";


/**  
 * @typedef {object} FileExplorer~Path
 * @property {'data' | 'config' | 'cache' | 'log' | 'temp'} addToKey 
 * @property {string} name 
*/

/** 
 * Create folders to store data for your awesome App. The instance is immutable.
 * 
 * @category Features
 * @subcategory Feature
 * @example 
 * 
 * import FileExplorer from "./file_explorer.js";
 * 
 * const explorer = new FileExplorer({
 *      name:"Automaton",
 *      additionalPath:[
 *          {name:"Profile",addToKey:"data"}
 *      ]
 * });
 * 
 * console.log(explorer.path);
 * 
 * //immutables
 * explorer.path.data = "C:\\jen"; //throw Error
*/
class FileExplorer{

    /**
     * @param {object} options
     * @param {string} options.name 
     * @param {FileExplorer~Path[]} [options.additionalPath=[]]
     * @param {boolean} [options.dryRun=false]
     */
    constructor({name, additionalPath = [], dryRun = false}){

        /**
         * @type {env}
        */
        this.env = env;

        /**
         * `dryRun` is a boolean option in the `FileExplorer` class constructor that, when set to
        `true`, creates the necessary directories for the app's data storage without actually
        writing any files to disk. This is useful for testing and debugging purposes, as it
        allows the developer to ensure that the necessary directories are being created without
        cluttering up the file system with unnecessary files.
         * @type {boolean}
         */
        this.dryRun = dryRun;

        /**
         * Creating an object that contains the paths to various directories where the app's
data will be stored. It uses the `envPaths` library to generate these paths based on the app's name
and the current environment (either "Development" or "Production", determined by the
`getCurrentEnv()` method). The `path.join()` method is used to concatenate the app's name and the
current environment into a single string that is passed to `envPaths()`. The resulting object
contains properties for the "data", "config", "cache", "log", and "temp" directories, as well as any
additional directories specified in the `additionalPath` parameter of the constructor. 
         * @type {object}
         * @property {string} data
         * @property {string} config
         * @property {string} cache
         * @property {string} log
         * @property {string} temp
         * @property {string} env - "The location of .env file"
         */
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

        // .env file
        // @ts-ignore
        this.path.env = path.join(this.path.config,".env");
        // @ts-ignore

        fsExtra.ensureFileSync(this.path.env);

        return Object.freeze(this);
    }

    /**
     * Get normalize current environment string based on process.env.NODE_ENV
     * 
     * @throws {Error} if process.env.NODE_ENV value not between 'development' | 'production' | 'testing'
     * @returns {'Development' | 'Production' | 'Testing'}
     */
    getCurrentEnv(){
        if(process.env.NODE_ENV == 'development'){
            return 'Development';
        }else if(process.env.NODE_ENV == 'production'){
            return 'Production';
        }else if(process.env.NODE_ENV == 'testing'){
            return 'Testing';
        }
    
        throw new Error(`Unknown ${process.env.NODE_ENV} Environment. Please choose 'production' or 'development' `);
    }
}

export default FileExplorer