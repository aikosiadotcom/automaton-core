export default Runtime;
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
 *  "@aikosia/automaton-plugin-rest-example-01": {},
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
     * @returns {module:Manifest}
     */
    static get manifest(): any;
    static get tasks(): any;
    /**
       * @param {object} [options] options
       * @param {string[]} [options.includeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to include
       * @param {string[]} [options.excludeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to exclude
       * @param {InterfacePackageManager} [options.packageManager={@link NpmPackageManager}]
       */
    constructor({ includeRegex, excludeRegex, packageManager }?: {
        includeRegex?: string[];
        excludeRegex?: string[];
        packageManager?: InterfacePackageManager;
    });
    /**
     * Run the runtime
     */
    run(): Promise<void>;
    _getRunOnInit(value: any): boolean;
    #private;
}
import App from "#src/app";
