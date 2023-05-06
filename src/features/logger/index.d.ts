export default Logger;
/**
 * @external winston
 */
/**
 * @name external:winston.createLogger
 * @see https://github.com/winstonjs/winston#usage
 */
/**
 * Creates a logger object using the Winston logging library. The logger can output logs to the console and/or send to Supabase server.
 *
 * @category Features
 * @subcategory Feature
 * @example
 *
 * import { createClient } from "@supabase/supabase-js";
 * import Logger from "./logger.js";
 *
 * const logger = new Logger({
 *      supabase:createClient(supabaseUrl,supabaseKey),
 *      winston:{
 *          level:"debug",
 *          defaultMeta:{
 *              projectKey:"",
 *              moduleKey:"",
 *              childModuleKey:""
 *          }
 *      },
 *      logger:{
 *          console:true,
 *          tableName:"winston_logs"
 *      }
 * });
 *
 * logger.log("error","Uncaught Exceptions", new Error("Hi, Jen!"));
*/
declare class Logger {
    /**
     *
     * @param {object} options
     * @param {external:SupabaseClient} options.supabase - {@link https://supabase.com/docs/reference/javascript/initializing}
     * @param {object} options.winston
     * @param {WinstonSupabaseTransport~LogLevel} [options.winston.level="debug"]
     * @param {object} options.winston.defaultMeta
     * @param {string} options.winston.defaultMeta.projectKey
     * @param {string} options.winston.defaultMeta.moduleKey
     * @param {string} options.winston.defaultMeta.childModuleKey
     * @param {object} [options.logger]
     * @param {boolean} [options.logger.console=true]
     * @param {string} [options.logger.tableName="winston_logs"]
     * @returns {external:winston.createLogger}
     */
    constructor(options: object);
}
