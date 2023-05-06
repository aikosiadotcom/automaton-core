import deepFreeze from "deep-freeze-es6";
import cron from 'node-cron';
import jsv from "json-validator";
import ManifestError from '#error/manifest_error';

/**
 * File descriptor for bot created by automaton framework
 * @category Runtimes
 * @subcategory Compiler
 */
class Manifest{
    /**
     * Returns available value for this property
     * @type {Array<"1.0.0">}
     */
    static get version(){
        return ["1.0.0"];
    }

    /**
     * Returns available value for this property
     * @type {Array<"rest"|"crawler">}
     */
    static get template(){
        return deepFreeze([
            'rest',
            'crawler'
        ]); 
    }

    /**
     * Returns available value for this property
     * @type {Array<'context'|'page'|'null'>}
     */
    static get runParameter(){
        return deepFreeze([
            'context',
            'page',
            'null'
        ]);
    }

    /**
     * @async
     * @param {Manifest} manifest
     * @returns {boolean}
     * @throws If manifest not valid
     * @see https://www.npmjs.com/package/json-validator#usage--examples
     */
    static async validate(manifest){
        await new Promise((resolve,reject)=>{
            jsv.validate(JSON.parse(JSON.stringify(manifest)),{
                version: {
                  required: true,
                  trim:true,
                  enum: ['1.0.0']
                },
                template:{
                    required:true,
                    trim:true,
                    enum: Manifest.template
                },
                cronjob: {
                  required: true,
                  trim: true,
                  asyncValidate: function(value, path, cb) {
                    if(value == false || value == "false"){
                        return cb(null,null);
                    }else{
                        if(!cron.validate(value)){
                            return cb({message:`wrong syntax of ${path} field. Please read: https://www.npmjs.com/package/node-cron`});
                        }else{
                            return cb(null,null);
                        }
                    }
                  }
                },  
                runParameter: {
                  required: true,
                  trim:true,
                  enum: Manifest.runParameter
                },
                profile: {
                    required: true,
                    trim:true
                }
            },(err,msg)=>{
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

        return true;
    }

    constructor({version,template,profile,runParameter,cronjob}){
        /**
         * @type {string}
         */
        this.version = version;
        /**
         * @type {string}
         */
        this.template = template;
        /**
         * @type {string}
         */
        this.profile = profile;
        /**
         * @type {string}
         */
        this.runParameter = runParameter;
        /**
         * @type {boolean | string}
         */
        this.cronjob = cronjob; 
    }
}

export default Manifest;

