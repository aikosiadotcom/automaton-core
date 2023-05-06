import EventEmitter from "#feature/event_emitter";
import Profiler from "#feature/profiler";
import Logger from "#feature/logger/index";
import FileExplorer from "#feature/file_explorer";
import ConstructorParamsRequiredError from "#error/constructor_params_required_error";
import EnvRequiredError from "#error/env_required_error";
import * as dotenv from "dotenv";
import envChecker from "node-envchecker";
import { createClient } from "@supabase/supabase-js";
import fsExtra from "fs-extra";
import path from "path";

/**
 * An abstract class that serves as a base for creating applications. It provides
several features such as logging, profiling, event handling, and file exploration. It also
initializes a Supabase client for database operations and checks for required environment variables.
The constructor takes a configuration object that can be used to customize the behavior of the
class.
 * @category Features
 * @subcategory API
 * @example 
 * 
 * import App from "./app.js";
 * 
 * class MyApp extends App{
 *    super({key:"MyApp",childKey:"MyAppModule"});
 * 
 *    constructor(){
 *      //you will have access to all of instance features class success logger,db,profiler,event,etc...
 *    }
 * }
 * 
 * @abstract
 */
class App{
  /**
   * @type {Logger}
   */
  logger;

  /**
   * @type {Profiler}
   */
  profiler;

  /**
   * @type {EventEmitter}
   */
  event;

  /**
   * @type {external:SupabaseClient}
   * @todo let consumer choose database service by themselves instead of only support for supabase
   */
  db;

  /** 
   * @type {FileExplorer}
  */
  explorer;

/**
 * @param {object} options - An object containing optional configuration options for the constructor.
 * @param {string} options.key - This key value will serves as moduleKey for module_key in supabase winston_logs tables
 * @param {string} options.childKey - This child key value will serves as childModuleKey for child_module_key in supabase winston_logs tables
 * @todo Provide additional argument for modify behaviour of features class
 */
  constructor(options) {

    if (!options.key || !options.childKey) {
      throw new ConstructorParamsRequiredError(["key", "childKey"]);
    }

    this.explorer = new FileExplorer({name:"Automaton",additionalPath:[{name:"Profile",addToKey:"data"}]});
    
    const requiredEnv = [
      "AUTOMATON_DAEMON_HOST",
      "AUTOMATON_DAEMON_PORT",
      "AUTOMATON_SUPABASE_URL",
      "AUTOMATON_SUPABASE_KEY",
    ];

    try {
      dotenv.config({ path: this._getEnvFile()});
      envChecker(requiredEnv);
    } catch (err) {
      throw new EnvRequiredError({ path: this.explorer.path["config"], requiredEnv });
    }

    let supabaseConfig = {};
    if (Object.keys(supabaseConfig).length == 0) {
      supabaseConfig = {
        url: process.env.AUTOMATON_SUPABASE_URL,
        secret: process.env.AUTOMATON_SUPABASE_KEY,
      };
      this.db = createClient(supabaseConfig.url, supabaseConfig.secret, {
        db: {
          schema: "public",
        },
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
        global: {
          headers: {},
        },
      });
    }

    let winstonConfig = {};
    if (Object.keys(winstonConfig).length == 0) {
      winstonConfig = {
        level: "debug",
        defaultMeta: {
          projectKey: this.explorer.getCurrentEnv(),
          moduleKey: options.key,
          childModuleKey: options.childKey,
        },
      };
    }

    let loggerConfig = {};
    if (Object.keys(loggerConfig).length == 0) {
      loggerConfig = {
        console: this.explorer.env.isPro(),
      };
    }

    this.event = new EventEmitter();

    this.logger = new Logger({
      supabase: this.db,
      winston: winstonConfig,
      logger: loggerConfig,
    });

    this.profiler = new Profiler(executionTimeReport=>this.logger.log("verbose", "execution time report", executionTimeReport));
  }

  /* c8 ignore start */
  _getEnvFile(){
    return fsExtra.existsSync(path.join(process.cwd(),".env")) ? path.join(process.cwd(),".env") : this.explorer.path["env"];
  }
  /* c8 ignore end */
}

export default App;;
