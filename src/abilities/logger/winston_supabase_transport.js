import Transport from 'winston-transport';

/**
 * @external Transport
 * @see https://github.com/winstonjs/winston#adding-custom-transports
 * */

/**
 * @typedef {Object} SupabaseOptions
 * @property {string} url - The API gateway for your Supabase project.
 * @property {string} secret - The anon key for your Supabase API.
 * @see https://supabase.com/docs/guides/database/connecting-to-postgres#api-url-and-keys
 */

/** 
 * @typedef {Object} WinstonSupabaseTransportOptions
 * @property {SupabaseOptions} supabase
 * @property {string} tableName - name of the table will be used to store logs on your supabase project.
 */

/**
 * @extends external:Transport
 */
class WinstonSupabaseTransport extends Transport {
    
    /**
     * 
     * @param {WinstonSupabaseTransportOptions} options
     */
    constructor(options = {}) {
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