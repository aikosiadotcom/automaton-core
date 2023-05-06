import deepFreeze from "deep-freeze-es6";
import cron from 'node-cron';
import jsv from "json-validator";
import ManifestError from '#error/manifest_error';

/**
* @typedef {object} Manifest~Schema 
* @property {Manifest~SchemaVersion} version
* @property {Manifest~SchemaTemplate} template
* @property {string} profile
* @property {Manifest~SchemaRunParameter} runParameter
* @property {boolean | string} cronjob
 */

/**
 * @typedef {"1.0.0"} Manifest~SchemaVersion
 */

/**
 * @typedef {"rest" | "crawler"} Manifest~SchemaTemplate
 */

/**
 * @typedef {'context' | 'page' | 'null'} Manifest~SchemaRunParameter
 */

/**
 * File descriptor for bot created by automaton framework
 * @category Runtimes
 * @subcategory Compiler
 */
class Manifest{
    /**
     * Returns available value for this property
     * @type {Array<Manifest~SchemaVersion>}
     */
    static get version(){
        return ["1.0.0"];
    }

    /**
     * Returns available value for this property
     * @type {Array<Manifest~SchemaTemplate>}
     */
    static get template(){
        return deepFreeze([
            'rest',
            'crawler'
        ]); 
    }

    /**
     * Returns available value for this property
     * @type {Array<Manifest~SchemaRunParameter>}
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
            jsv.validate(typeof Manifest === 'Manifest' ? manifest.toObject() : JSON.parse(JSON.stringify(manifest)),{
                version: {
                  required: true,
                  trim:true,
                  enum: Manifest.version
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

    /**
     * @param {Manifest~Schema}
     */
    constructor({version,template,profile,runParameter,cronjob}){
        /**
         * @type {Manifest~SchemaVersion}
         */
        this.version = version;
        /**
         * @type {Manifest~SchemaTempalte}
         */
        this.template = template;
        /**
         * @type {string}
         */
        this.profile = profile;
        /**
         * @type {Manifest~SchemaRunParameter}
         */
        this.runParameter = runParameter;
        /**
         * @type {boolean | string}
         */
        this.cronjob = cronjob; 
    }

    /**
     * @returns {Manifest~Schema}
     */
    toObject(){
        return JSON.parse(JSON.stringify({
            version:this.version,
            template:this.template,
            profile:this.profile,
            runParameter:this.runParameter,
            cronjob:this.cronjob
        }));
    }
}

export default Manifest;

