import EventEmitter from "#feature/event_emitter";
import Profiler from "#feature/profiler";
import Logger from "#feature/logger/index";
import FileExplorer from "#feature/file_explorer";
import ConstructorParamsRequiredError from "#error/constructor_params_required_error";
import EnvRequiredError from "#error/env_required_error";
import * as dotenv from "dotenv";
import envChecker from "node-envchecker";
import { createClient } from "@supabase/supabase-js";

/**
 * @external winston.Logger
 * @see https://github.com/winstonjs/winston
 * */

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
   * @external supabase
   */
  db;

  /** 
   * @type {FileExplorer}
  */
  explorer;

  constructor(config = {}) {

    if (!config.key || !config.childKey) {
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
      dotenv.config({ path: this.explorer.path["env"] });
      envChecker(requiredEnv);
    } catch (err) {
      throw new EnvRequiredError({ path: this.explorer.path["config"], requiredEnv });
    }

    let supabaseConfig = config.supabase ?? {};
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

    let winstonConfig = config.winston ?? {};
    if (Object.keys(winstonConfig).length == 0) {
      winstonConfig = {
        level: "debug",
        defaultMeta: {
          projectKey: this.explorer.getCurrentEnv(),
          moduleKey: config.key,
          childModuleKey: config.childKey,
        },
      };
    }

    let loggerConfig = config.logger ?? {};
    if (Object.keys(loggerConfig).length == 0) {
      loggerConfig = {
        console: this.explorer.env.isPro(),
      };
    }

    this.event = new EventEmitter();

    this.logger = new Logger({
      supabase: this.db,
      winston: winstonConfig,
      loggerConfig: loggerConfig,
    });

    this.profiler = new Profiler(executionTimeReport=>this.logger.log("verbose", "execution time report", executionTimeReport));
  }
}

export default App;;
