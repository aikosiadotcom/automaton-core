export default Automaton;
/**
 * Fired when bot start running
 * @event Automaton#start
 * @example
 * this.event.on('start',()=>{
 *      console.log('bot start running');
 * });
 */
/**
 * Fired when bot run finish even error happened.
 *
 * @event Automaton#end
 * @type {Profiler~ExecutionTimeReport}
 *
 * @example
 *
 * this.event.on('end',(executionTimeReport)=>{
 *      console.log('report',executionTimeReport);
 * });
 */
/**
 * Fired when there's a exception during bot run
 *
 * @event Automaton#error
 * @type {Error}
 * @example
 *
 * this.event.on('end',(err)=>{
 *      console.log('error',err);
 * });
 */
/**
 * Consumer or writer of automaton bot will inherited this class
 * @example
 *
 * import Automaton from '@aikosia/automaton-core';
 *
 * class MyBot extends Automaton{
 *      constructor(){
 *          super({key:"MyBot"});
 *      }
 *
 *      //must override this method
 *      async run(page){
 *      }
 * }
 *
 * @category API
 * @extends App
 */
declare class Automaton extends App {
    /**
     * @param {object} options
     * @param {string} options.key This key will be used by [Logger]{@link Logger}
     */
    constructor(options: {
        key: string;
    });
    /**@type {Manifest} */
    manifest: Manifest;
    endpoint: string;
    /**
     * Consumer must implement this method
     * @async
     * @param {Manifest.runParameter} arg
     */
    run(arg: string[]): Promise<void>;
    #private;
}
import App from "#src/app";
import Manifest from "#runtime/manifest";
