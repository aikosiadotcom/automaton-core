// @ts-nocheck
import Transport from 'winston-transport';

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
class WinstonSupabaseTransport extends Transport {
    
    /**
     * @param {object} options
     * @param {string} options.tableName - Name of the table to hold logs
     * @param {external:SupabaseClient} options.supabaseClient
     * @param {string} [options.name="Winston-Supabase-Logger"]
     * @param {WinstonSupabaseTransport~LogLevel} [options.level="debug"] - {@link https://github.com/winstonjs/winston#logging-levels}
     * @param {boolean} [options.silent=false]
     */
    constructor(options) {
        super(options);

        if (!options.tableName || !options.supabaseClient) {
            throw new Error("WinstonSupabaseTransport Object Cannot Missing Options And Cannot Be created");
        }

        this.name = options.name || 'Winston-Supabase-Logger';

        this.level = options.level || 'debug';

        this.silent = options.silent || false;

        const tableName = options.tableName;

        const supabaseClient = options.supabaseClient;

        this.logsTable = supabaseClient.from(tableName);

    }

    async log(args, callback) {
        const { logsTable } = this;
        const { project_key, module_key, child_module_key, level, message, ...metax } = args;
        const meta = metax.stack ?? metax[Symbol.for('splat')];

        setImmediate(() => {
            this.emit('logged', args);
        });
        await logsTable.insert([
            { project_key, module_key, child_module_key, message, meta, level}
        ]);
        callback();
    }
}

export default WinstonSupabaseTransport