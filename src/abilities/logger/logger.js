import WinstonSupabaseTransport from "./winston_supabase_transport.js";
import winston from "winston";

class Logger{
    constructor(config){
        const {supabase:supabaseClient,winston:winstonConfig,logger:loggerConfig} = config ?? {};
        const {level,defaultMeta} = winstonConfig ?? {level:"info",defaultMeta:{projectKey:"",moduleKey:""}};
        const {projectKey,moduleKey} = defaultMeta;
        const {console,tableName} = loggerConfig ?? {console:true, tableName: "winston_logs"};

        const transports = [];

        if(console){
            transports.push(new winston.transports.Console());
        }
        
        if(supabaseClient){
            transports.push(new WinstonSupabaseTransport({
                supabaseClient:supabaseClient,
                tableName:tableName
              }))
        }

        return winston.createLogger({
            level: level,
            format: winston.format.json(),
            defaultMeta: { project_key: projectKey, module_key: moduleKey },
            transports: transports,
        });
    }
}

export default Logger;