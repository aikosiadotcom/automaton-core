import { deepFreeze } from "deep-freeze-es6";
import App from "#src/app";
import path from "path";
import NpmPackageManager from '#plugin_loader/npm_package_manager'

/**
 * Load plugins of automaton
 */
class PluginLoader extends App{
  #includeRegex;
  #excludeRegex;
  root;
  packages;

  /**
   * Creates an instance of PluginLoader.
   * @param {Object} options 
   * @param {[]<string>} [includeRegex] - which plugin you wanna to load based on regex syntax
   * @param {[]<string>} [ignoreRegex] - which plugin you wanna to ignore based on regex syntax
   * @param {<string>} [root] - loader will load plugin from this path
   * @memberof PluginLoader
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
   * 
   * @example
   * const loader = new PluginLoader({
   *    includeRegex: ['@aikosia/automaton-'],
   *    ignoreRegex: []
   * });
   */
  constructor({ includeRegex = [], excludeRegex = [], packageManager = new NpmPackageManager() }) {
    super({key:'Core',childKey:'PluginLoader'});

    if(includeRegex.length == 0){
      throw new Error("includeRegex required")
    }

    this.#includeRegex = includeRegex;
    this.#excludeRegex = excludeRegex;
    this.root = deepFreeze(packageManager.root());
    this.packages = deepFreeze(packageManager.ls());
    
    Object.freeze(this); 
  }

  async ls() {
    const installed = Object.entries(
     this.packages
    ).map((arr, index) => ({ name: arr[0], meta: arr[1] }));

    const candidates = installed.filter(
      (automaton) =>
        this.#includeRegex.filter((pattern) =>
          automaton.name.match(new RegExp(pattern))
        ).length &&
        !this.#excludeRegex.filter((pattern) =>
          automaton.name.match(new RegExp(pattern))
        ).length
    );

    const excluded = installed.filter(
      (automaton) =>
        this.#excludeRegex.filter((pattern) =>
          automaton.name.match(new RegExp(pattern))
        ).length
    );

    const ret = deepFreeze({ 
      installed: installed.map(({name})=>({name:name,root:path.join(this.root,name)})), 
      candidates: candidates.map(({name})=>({name:name,root:path.join(this.root,name)})), 
      excluded: excluded.map(({name})=>({name:name,root:path.join(this.root,name)}))});

    
      this.logger.log("verbose","output",ret);

      return ret;
    }
}

export default PluginLoader;
