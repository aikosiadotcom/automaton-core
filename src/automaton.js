import axios from "axios";
import {chromium} from 'playwright-core';
import App from "#src/app";
import MustOverrideError from "#error/must_override_error";
import ManifestError from "#error/manifest_error";
import AbstractClassError from "#error/abstract_class_error";
import Manifest from "#runtime/manifest";
/**
 * Fired when bot start running
 * @event Automaton#start
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
    /**@type {Manifest} */
    manifest;
    endpoint;
    #package;
    #idTask;

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
        this.endpoint = `${host}:${port}`;

        /**
         * Since we dont wanna force consumer of this class to always provided options manifest when they inherited this class. So, it must implemented this way
         */
        this.event.on('#run',async({plugin, endpoint = ""})=>{
            this.#package = plugin;
            await this.#run({manifest:plugin.name, endpoint});
        });

        this.event.on("start",async()=>{
            if(this.db){
                const {data} = await this.db.from('running_tasks').insert({name:this.#package.name});
                this.#idTask = data[0].id;
            }
        });
        this.event.on("finish",async()=>{
            this.db ? await this.db.from('running_tasks').update({success:true,end:((new Date()).toISOString()).toLocaleString('id-ID')}) : null;
        });
        this.event.on("error",async(err)=>{
            this.db ? await this.db.from('running_tasks').update({success:false,end:((new Date()).toISOString()).toLocaleString('id-ID'),message:[err]}) : null;
        });

        this.event.on('save',async(input,output)=>{
            this.db ? await this.db.from("tasks_output").insert({
                name:this.#package.name,
                input:input,
                output:output
            }) : null;
        });
    }

    /**
     * @async
     * @param {object} options 
     * @param {Manifest} options.manifest 
     * @param {string} [options.endpoint=""] - if endpoint not provided, then it will attempt to get the url from remote server
     */
    async #run({manifest, endpoint}){
        try{ 
            if(endpoint!=""){
                this.endpoint = endpoint;
            }
            
            /**
             * @fires Automaton#start
             */
            /* c8 ignore end */
            await this.event.emit("start");
            this.profiler.start("run");

            if(this.manifest == undefined || JSON.stringify(this.manifest) !== manifest){
                //since this event listener using 'on' not 'once'
                this.manifest = manifest;
                const url = (await axios.get(`${this.endpoint}/browser/${this.manifest["profile"]}`)).data;
                this.#browser = await chromium.connectOverCDP(url);
                this.#context = this.#browser.contexts()[0];
        
                //TODO: Consider to change it to plugin maybe like puppeteer-extra-plugin. 
                /* c8 ignore start */
                this.#context.on("page",(page)=>{
                    page.automaton = {};
                    page.automaton.waitForResponse = async({goto,pattern,responseType="json"})=>{
                        const responsePromise  = page.waitForResponse((resp)=>resp.url().match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
                        await page.goto(goto);
                        const response = await responsePromise;
                        return await response[responseType]();
                    }
        
                    return page;
                });
            }
            
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

            await this.event.emit("finish");
        }catch(err){
            this.logger.log("error","RuntimeException",err);
            /**
             * @fires Automaton#error
             */
            await this.event.emit('error',err);
            // throw err;
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
     * @param {Manifest.runParameter} arg
     */
    async run(arg){
        throw new MustOverrideError(`please override run method on ${this.manifest.name}. example: async run(arg)=>{}`);
    }

    getOptions(){
        let opts = JSON.stringify(this.manifest.options);
        for(let [key,value] in this.manifest.input){
            opts = opts.replaceAll(`:${key}`,value);
        }
        return opts;
    }
}

export default Automaton;