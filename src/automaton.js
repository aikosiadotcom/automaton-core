import axios from "axios";
import {chromium} from 'playwright-core';
import App from "#src/app";
import MustOverrideError from "#error/must_override_error";
import ManifestError from "#error/manifest_error";
import AbstractClassError from "#error/abstract_class_error";

/**
 * @extends App
 */
class Automaton extends App{
    #browser;
    _context;
    _manifest;
    _endpoint;

    constructor(config){
        super(Object.assign(config,{
            key:"Core",
            childKey:config.key
        }));
        
        if(this.constructor === Automaton){
            throw new AbstractClassError();
        }
        
        /* c8 ignore start */
        const {daemon: daemonConfig = {}} = config ?? {};
        /* c8 ignore end */

        let {host,port} = daemonConfig ?? {};
        if(Object.keys(daemonConfig).length == 0){
            host = process.env.AUTOMATON_DAEMON_HOST || "http://localhost";
            port = process.env.AUTOMATON_DAEMON_PORT || 3000;
        }

        this._endpoint = `${host}:${port}/browser`;

        this.event.once('_run',async(manifest)=>{
            await this.#run(manifest);
        });
    }

    async #run(manifest){
        try{ 
            this._manifest = manifest;
            const {data} = await axios.get(`${this._endpoint}/${this._manifest["profile"]}`);
            this.#browser = await chromium.connectOverCDP(data);
            this._context = this.#browser.contexts()[0];
    
            //TODO: kedepan ada waktu ubah jadi plugin saja, menambahkan new method ke Page Class. 
            /* c8 ignore start */
            this._context.on("page",(page)=>{
                page.automaton = {};
                page.automaton.waitForResponse = async({goto,waitUrl,responseType="json"})=>{
                    const responsePromise  = page.waitForResponse((resp)=>resp.url().includes(waitUrl));
                    await page.goto(goto);
                    const response = await responsePromise;
                    return await response[responseType]();
                }
    
                return page;
            });
            /* c8 ignore end */
            await this.event.emit("_start");
            this.profiler.start("run");
            
            /**template processor */
            if(this._manifest.template == 'crawler'){
                /**runParameter */
                if(this._manifest.runParameter == "page"){
                    const page = await this._context.newPage();
                    await this.run(page);
                    await page.close();
                }else if(this._manifest.runParameter == "context"){
                    await this.run(this._context);
                }else{
                    await this.run(null);
                }
            }else if(this._manifest.template == 'rest'){
            }else{
                throw new ManifestError({message:`template processor "${this._manifest.template}" not found`});
            }
        }catch(err){
            this.logger.log("error","RuntimeException",err);
        }finally{
            await this.event.emit('_end',this.profiler.stop("run"));
        }
    }

    async run(contextOrPageOrNone){
        throw new MustOverrideError('please override run method. example: async run(contextOrPageOrNone)=>{}');
    }
}

export default Automaton;