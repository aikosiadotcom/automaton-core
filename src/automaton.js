import axios from "axios";
import {chromium} from 'playwright-core';
import App from "#src/app";
import MustOverrideError from "#error/must_override_error";
import ManifestError from "#error/manifest_error";
import AbstractClassError from "#error/abstract_class_error";

/**
 * Fired when bot start running
 * @event Automaton#start
 * @memberof Automaton
 * @example
 * this.event.on('start',()=>{
 *      console.log('bot start running');
 * });
 */

/**
 * Fired when bot run finish even error happened.
 * 
 * @event Automaton#end
 * @type {Profiler~ExecutionTimeReport}
 * 
 * @example
 * 
 * this.event.on('end',(executionTimeReport)=>{
 *      console.log('report',executionTimeReport);
 * });
 */

/**
 * Fired when there's a exception during bot run
 * 
 * @event Automaton#error
 * @type {Error}
 * @example
 * 
 * this.event.on('end',(err)=>{
 *      console.log('error',err);
 * });
 */

/**
 * Consumer or writer of automaton bot will inherited this class
 * @example 
 * 
 * import Automaton from '@aikosia/automaton-core';
 * 
 * class MyBot extends Automaton{
 *      constructor(){
 *          super({key:"MyBot"});
 *      }
 *      
 *      //must override this method
 *      async run(page){
 *      }
 * }
 * 
 * @category API
 * @extends App
 */
class Automaton extends App{
    #browser;
    #context;
    manifest;
    endpoint;

    /**
     * @param {object} options
     * @param {string} options.key This key will be used by [Logger]{@link Logger}
     */
    constructor(options){
        super(Object.assign(options,{
            key:"Core",
            childKey:options.key
        }));
        
        if(this.constructor === Automaton){
            throw new AbstractClassError();
        }
        
        /* c8 ignore start */
        const {daemon: daemonConfig = {}} = options ?? {};
        /* c8 ignore end */

        let {host,port} = daemonConfig ?? {};
        if(Object.keys(daemonConfig).length == 0){
            host = process.env.AUTOMATON_DAEMON_HOST || "http://localhost";
            port = process.env.AUTOMATON_DAEMON_PORT || 3000;
        }

        /**
         * will be used to fetch url of CDP (Chrome Devtools Protocol)
         * @type {string} 
         */
        this.endpoint = `${host}:${port}/browser`;

        /**
         * Since we dont wanna force consumer of this class to always provided options manifest when they inherited this class. So, it must implemented this way
         */
        this.event.once('#run',async(manifest)=>{
            await this.#run(manifest);
        });
    }

    /**
     * @async
     * @param {Manifest~Schema} manifest 
     */
    async #run(manifest){
        try{ 
            this.manifest = manifest;
            const {data} = await axios.get(`${this.endpoint}/${this.manifest["profile"]}`);
            this.#browser = await chromium.connectOverCDP(data);
            this.#context = this.#browser.contexts()[0];
    
            //TODO: Consider to change it to plugin maybe like puppeteer-extra-plugin. 
            /* c8 ignore start */
            this.#context.on("page",(page)=>{
                page.automaton = {};
                page.automaton.waitForResponse = async({goto,waitUrl,responseType="json"})=>{
                    const responsePromise  = page.waitForResponse((resp)=>resp.url().includes(waitUrl));
                    await page.goto(goto);
                    const response = await responsePromise;
                    return await response[responseType]();
                }
    
                return page;
            });
            
            /**
             * @fires Automaton#start
             */
            /* c8 ignore end */
            await this.event.emit("start");
            this.profiler.start("run");
            
            /**template processor */
            if(this.manifest.template == 'crawler' || this.manifest.template == 'rest'){
                /**runParameter */
                if(this.manifest.runParameter == "page"){
                    const page = await this.#context.newPage();
                    await this.run(page);
                    await page.close();
                }else if(this.manifest.runParameter == "context"){
                    await this.run(this.#context);
                }else{
                    await this.run(null);
                }
            }else{
                throw new ManifestError({message:`template processor "${this.manifest.template}" not found`});
            }
        }catch(err){
            /**
             * @fires Automaton#error
             */
            await this.event.emit('error',err);
            this.logger.log("error","RuntimeException",err);
        }finally{
            /**
             * @fires Automaton#start
             */
            await this.event.emit('end',this.profiler.stop("run"));
        }
    }

    /**
     * Consumer must implement this method
     * @async
     * @param {Manifest~SCHEMA_RUN_PARAMETER} arg
     */
    async run(arg){
        throw new MustOverrideError('please override run method. example: async run(arg)=>{}');
    }
}

export default Automaton;