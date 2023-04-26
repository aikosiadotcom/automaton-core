import EventEmitter from "./abilities/event_emitter.js";
import Profiler from './abilities/profiler.js';
import Logger from './abilities/logger/logger.js';
import AbstractClassError from "./error/abstract_class_error.js";
import EnvRequiredError from "./error/env_required_error.js";
import * as dotenv from "dotenv";
import envChecker from "node-envchecker";
import { createClient } from '@supabase/supabase-js';
import * as System from './system.js';

/**
 * @external winston.Logger
 * @see https://github.com/winstonjs/winston
 * */

class Ability{
    /**
     * @type {winston.Logger} @link winston.Logger
    */
    logger;

    /**
     * @type {Profiler}
     */
    profiler;

    /**
     * @type {EventEmitter}
     */
    emitter;

    /**
     * @type {supabase} 
     */
    db;

    constructor(config = {}){
        // if(this.constructor == Ability){
        //     throw new AbstractClassError();
        // }

        const requiredEnv = [
            'AUTOMATON_DAEMON_HOST',
            'AUTOMATON_DAEMON_PORT',
            'AUTOMATON_SUPABASE_URL',
            'AUTOMATON_SUPABASE_KEY'
        ];

        try{
            dotenv.config({ path: System.getPath("env") });
            envChecker(requiredEnv);
        }catch(err){
            throw new EnvRequiredError({path:System.getPath("config"),requiredEnv});
        }
        
        let supabaseConfig = config.supabase ?? {};
        if(Object.keys(supabaseConfig).length == 0){
            supabaseConfig = {
                url:process.env.AUTOMATON_SUPABASE_URL,
                secret:process.env.AUTOMATON_SUPABASE_KEY
            }
            this.db = createClient(supabaseConfig.url, supabaseConfig.secret,{
                db: {
                  schema: 'public',
                },
                auth: {
                  autoRefreshToken: true,
                  persistSession: true,
                  detectSessionInUrl: true
                },
                global: {
                  headers: {},
                },
            });
        }

        let winstonConfig = config.winston ?? {};
        if(Object.keys(winstonConfig).length == 0){
            winstonConfig = {
                level:"info",
                defaultMeta:{
                    projectKey:process.env.NODE_ENV != 'production' ? "automaton-dev" : 'automaton',
                    moduleKey:config.key
                }
            }
        }

        let loggerConfig = config.logger ?? {};
        if(Object.keys(loggerConfig).length == 0){
            loggerConfig = {
                console:process.env.NODE_ENV != 'production'
            }
        }

        this.emitter = new EventEmitter();

        this.logger = new Logger({
            supabase:this.db,
            winston:winstonConfig,
            loggerConfig:loggerConfig
        });
          
        this.profiler = new Profiler((meta)=>{
            this.logger.log("info","profiling",meta);
        });
    }
}

export default Ability;