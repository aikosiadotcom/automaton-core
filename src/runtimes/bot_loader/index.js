import { deepFreeze } from "deep-freeze-es6";
import App from "#src/app";
import NpmPackageManager from '#bot_loader/npm_package_manager'
import InterfacePackageManager from "#bot_loader/interface_package_manager";
import extend from 'extend';


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
 * import PluginLoader from './bot_loader.js';
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
 *      name: '@aikosiadotcom/automaton-bot-rest-example-01',
 *      root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\mocks\\plugins\\aikosia\\automaton-bot-rest-example-01'
 *    },
 *    {
 *      name: '@aikosia/automaton-bot-rest-example-02',
 *      root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\mocks\\plugins\\aikosia\\automaton-bot-rest-example-02'
 *    }
 *  ],
 *  candidates: [
 *    {
 *      name: '@aikosia/automaton-bot-rest-example-02',
 *      root: 'C:\\drive-d\\automaton\\automaton_modules\\automaton-core\\src\\mocks\\plugins\\aikosia\\automaton-bot-rest-example-02'
 *    }
 *  ],
 *  excluded: []
 * }
 * 
 * @category Runtimes
 * @subcategory Loader
 * @extends App
 */
class PluginLoader extends App{
  #includeRegex;
  #excludeRegex;
  #packageManager;
  root;
  packages;

  /**
   * @param {object} options
   * @param {string[]} options.includeRegex - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to include
   * @param {string[]} [options.excludeRegex] - using [String.prototype.match]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match} to perform which plugin to exclude
   * @param {InterfacePackageManager} [options.packageManager={@link NpmPackageManager}]
   */
  constructor(options) {
    options = extend(true,{
        includeRegex:[],
        excludeRegex:[],
        packageManager:new NpmPackageManager()
    },options);
    super({key:'Core',childKey:'PluginLoader'});

    const {includeRegex,excludeRegex,packageManager} = options;
    if(includeRegex.length == 0){
      throw new Error("includeRegex required")
    }

    this.#includeRegex = includeRegex;
    this.#excludeRegex = excludeRegex;
    this.#packageManager = packageManager;
    /**
     * The root location of all plugins are stored
     * 
     * @type {string} 
     */
    this.root = packageManager.root();
    /**
     * List of all plugins 
     * 
     * @example
     * {
     *   "plugin_id_01":{},
     *   "plugin_id_02":{},
     *   "plugin_id_03":{}
     * }
     * 
     * @type {Object.<string, object>}
     */
    this.packages = packageManager.ls();
    
    return Object.freeze(this);
  }

  /**
   * ls stands for list. This method will list all plugins based on include and exclude regex passed on constructor.
   * 
   * @returns {Promise<PluginLoader~FilteredImmutablePlugins>}
   */
  async ls() {
      const installed = Object.entries(
      this.packages
      ).map((arr, index) => ({ name: arr[0], meta: arr[1] }));

      const candidates = installed.filter(
        (automaton) =>
          this.#includeRegex.filter((pattern) =>
            automaton.name.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
          ).length &&
          !this.#excludeRegex.filter((pattern) =>
            automaton.name.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
          ).length
      );

      const excluded = installed.filter(
        (automaton) =>
          this.#excludeRegex.filter((pattern) =>
            automaton.name.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
          ).length
      );

      const ret = { 
        installed: installed.map(({name})=>({name:name,root:this.#packageManager.resolve(name)})), 
        candidates: candidates.map(({name})=>({name:name,root:this.#packageManager.resolve(name)})), 
        excluded: excluded.map(({name})=>({name:name,root:this.#packageManager.resolve(name)}))}

      this.logger.log("verbose","output",ret);

      return deepFreeze(ret);
    }
}

export default PluginLoader;
