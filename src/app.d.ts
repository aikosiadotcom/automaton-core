export default App;
/**
 * An abstract class that serves as a base for creating applications. It provides
several features such as logging, profiling, event handling, and file exploration. It also
initializes a Supabase client for database operations and checks for required environment variables.
The constructor takes a configuration object that can be used to customize the behavior of the
class.
 * @category API
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
 */
declare class App {
    /**
     * @param {object} options - An object containing optional configuration options for the constructor.
     * @param {string} options.key - This key value will serves as moduleKey for module_key in supabase winston_logs tables
     * @param {string} options.childKey - This child key value will serves as childModuleKey for child_module_key in supabase winston_logs tables
     * @todo Provide additional argument for modify behaviour of features class
     */
    constructor(options: {
        key: string;
        childKey: string;
    });
    /**
     * @type {Logger}
     */
    logger: Logger;
    /**
     * @type {Profiler}
     */
    profiler: Profiler;
    /**
     * @type {EventEmitter}
     */
    event: EventEmitter;
    /**
     * @type {external:SupabaseClient}
     * @todo let consumer choose database service by themselves instead of only support for supabase
     */
    db: External;
    /**
     * @type {FileExplorer}
    */
    explorer: FileExplorer;
    _getEnvFile(): any;
}
import Logger from "#feature/logger/index";
import Profiler from "#feature/profiler";
import EventEmitter from "#feature/event_emitter";
import FileExplorer from "#feature/file_explorer";
