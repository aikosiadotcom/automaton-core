export default Runtime;
/**
 * The Map object is a simple key/value map. Any value (both objects and primitive values) may be used as either a key or a value.
 * @external Map
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 */
/**
 * To load plugins and run it
 *
 * @example
 * import Runtime from "./runtime.v1.js";
 *
 * const runtime = new Runtime({includeRegex:["@aikosia/automaton-"],packageManager:new TestPackageManager()});
 *
 * //assume new TestPackageManager when ls is called, it will return
 * {
 *  "@aikosia/automaton-bot-rest-example-01": {},
 * }
 *
 * await runtime.run();
 * }
 *
 * @category API
 * @extends App
*/
declare class Runtime extends App {
    /**
     * Get the Manifest class
     * @type {Manifest}
     */
    static get Manifest(): Manifest;
    /**
     * Get the InterfacePackageManager class
     * @type {InterfacePackageManager}
     */
    static get InterfacePackageManager(): InterfacePackageManager;
    /**
     * Get the running tasks
     * @type {Map}
     */
    static get tasks(): Map<any, any>;
    /**
     * Get Package Manager Provider
     *
     * @param {string} key
     * @returns {InterfacePackageManager}
     */
    static getPackageManager(key?: string): InterfacePackageManager;
    /**
     * @param {object} [options] options
     * @param {string[]} [options.includeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to include
     * @param {string[]} [options.excludeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to exclude
     * @param {InterfacePackageManager} [options.packageManager={@link NpmPackageManager}]
    */
    constructor(options?: {
        includeRegex?: string[];
        excludeRegex?: string[];
        packageManager?: InterfacePackageManager;
    });
    /**
     * Run the runtime
     *
     * @param {object} [options = {}]
     * @param {string} [endpoint=""]
     */
    run(options?: object): Promise<void>;
    automata: import("./compiler/generator.js").default[];
    /**
     *
     * @param {boolean} value
     * @returns {boolean}
     */
    _getRunOnInit(value: boolean): boolean;
    #private;
}
import App from "#src/app";
import Manifest from "#runtime/manifest";
import InterfacePackageManager from '#bot_loader/interface_package_manager';
