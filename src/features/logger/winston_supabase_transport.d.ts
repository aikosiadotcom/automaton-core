export default WinstonSupabaseTransport;
/**
 * ~LogLevel
 */
export type WinstonSupabaseTransport = ("error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly");
/**
 * @external Transport
 * @see https://github.com/winstonjs/winston-transport
 */
/**
 * @external SupabaseClient
 * @see https://supabase.com/docs/reference/javascript/initializing
 */
/**
 * @typedef {("error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly")} WinstonSupabaseTransport~LogLevel
 */
/**
 * Acts as a transport for winston to sending logs to Supabase server.
 * This class will be used by [Logger]{@link Logger} internally.
 * @category Features
 * @subcategory Internal
 * @example
 *
 * import winston from "winston";
 * import { createClient } from "@supabase/supabase-js";
 * import WinstonSupabaseTransport from "./winston_supabase_transport.js";
 *
 * const client = createClient(supabaseUrl,supabaseKey);
 * const logger = winston.createLogger({
 *      defaultMeta: {},
 *      transports: [
 *          new WinstonSupabaseTransport({tableName:'logs',supabaseClient:client})
 *      ]
 * });
 *
 * logger.log("info","Hello Jen", {meta:"accept additional object type"});
 * @see https://github.com/winstonjs/winston#adding-custom-transports
 *
 * @extends external:Transport
 */
declare class WinstonSupabaseTransport {
    /**
     * @param {object} options
     * @param {string} options.tableName - Name of the table to hold logs
     * @param {external:SupabaseClient} options.supabaseClient
     * @param {string} [options.name="Winston-Supabase-Logger"]
     * @param {WinstonSupabaseTransport~LogLevel} [options.level="debug"] - {@link https://github.com/winstonjs/winston#logging-levels}
     * @param {boolean} [options.silent=false]
     */
    constructor(options: {
        tableName: string;
    });
    name: any;
    level: any;
    silent: any;
    logsTable: any;
    log(args: any, callback: any): Promise<void>;
}
