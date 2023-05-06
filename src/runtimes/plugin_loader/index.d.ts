export default PluginLoader;
/**
 * ~LoadedImmutablePlugin
 */
export type PluginLoader = {
    /**
     * - The plugin name and at the same time will be the identifier
     */
    name: string;
    /**
     * - The root location of this plugin
     */
    root: string;
};
/**
 * @typedef {object} PluginLoader~LoadedImmutablePlugin
 * @property {string} name - The plugin name and at the same time will be the identifier
 * @property {string} root - The root location of this plugin
 */
/**
 * @typedef {object} PluginLoader~FilteredImmutablePlugins
 * @property {Array<PluginLoader~LoadedImmutablePlugin>} installed - List of the plugins find on the system
 * @property {Array<PluginLoader~LoadedImmutablePlugin>} candidates - List of the plugins that will be run
 * @property {Array<PluginLoader~LoadedImmutablePlugin>} excluded - List of the excluded plugin
 */
/**
 * This class will list all of the plugins find in the host and perform filter based on include or exclude regex
 *
 * @example
 *
 * import PluginLoader from './plugin_loader.js';
 *
 * const loader = new PluginLoader({includeRegex:["@aikosia/automaton-"]});
 * const root = await loader.root();
 * const result = await loader.ls();
 * console.log(result);
 *
 * Console Terminal Output:
 * {
 *  installed: [
 *    {
 *      name: '@aikosiadotcom/automaton-plugin-rest-example-01',
 *      root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\mocks\\plugins\\aikosia\\automaton-plugin-rest-example-01'
 *    },
 *    {
 *      name: '@aikosia/automaton-plugin-rest-example-02',
 *      root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\mocks\\plugins\\aikosia\\automaton-plugin-rest-example-02'
 *    }
 *  ],
 *  candidates: [
 *    {
 *      name: '@aikosia/automaton-plugin-rest-example-02',
 *      root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\mocks\\plugins\\aikosia\\automaton-plugin-rest-example-02'
 *    }
 *  ],
 *  excluded: []
 * }
 *
 * @category Runtimes
 * @subcategory Loader
 * @extends App
 */
declare class PluginLoader extends App {
    /**
     * @param {object} options
     * @param {string[]} options.includeRegex - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to include
     * @param {string[]} [options.excludeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to exclude
     * @param {InterfacePackageManager} [options.packageManager={@link NpmPackageManager}]
     */
    constructor({ includeRegex, excludeRegex, packageManager }: {
        includeRegex: string[];
        excludeRegex?: string[];
        packageManager?: InterfacePackageManager;
    });
    root: any;
    packages: {
        [x: string]: any;
    };
    /**
     * ls stands for list. This method will list all plugins based on include and exclude regex passed on constructor.
     *
     * @returns {Promise<PluginLoader~FilteredImmutablePlugins>}
     */
    ls(): Promise<PluginLoader>;
    #private;
}
import App from "#src/app";
import InterfacePackageManager from "#plugin_loader/interface_package_manager";
