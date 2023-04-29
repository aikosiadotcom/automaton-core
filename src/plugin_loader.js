import { execSync } from "child_process";
import { deepFreeze } from "deep-freeze-es6";
import Ability from "./ability.js";
import path from "path";

/**
 * Load plugins of automaton
 */
class PluginLoader extends Ability{
  #includeRegex;
  #ignoreRegex;
  #root;

  /**
   * Creates an instance of PluginLoader.
   * @param {Object} options 
   * @param {[]<string>} [includeRegex] - which plugin you wanna to load based on regex syntax
   * @param {[]<string>} [ignoreRegex] - which plugin you wanna to ignore based on regex syntax
   * @memberof PluginLoader
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
   * 
   * @example
   * const loader = new PluginLoader({
   *    includeRegex: ['@aikosia/automaton-'],
   *    ignoreRegex: []
   * });
   */
  constructor({ includeRegex = [], ignoreRegex = [] }) {
    super({key:'Core',childKey:'PluginLoader'});
    this.#includeRegex = includeRegex;
    this.#ignoreRegex = ignoreRegex;
    this.#root = PluginLoader.root;
  }

  /**
   * Returns the root directory location where all plugins are stored
   *
   * @readonly
   * @static
   * @memberof PluginLoader
   * @example
   * console.log(PluginLoader.root());
   * @returns {string}
   */
  static get root() {
    return execSync(`npm root -g`).toString().replace("\n", "");
  }

  
  async ls() {
    const installedNpmGlobalPackages = execSync(
      `npm ls -g --depth=0 --json=true`
    );

    const installed = Object.entries(
      JSON.parse(installedNpmGlobalPackages.toString())["dependencies"]
    ).map((arr, index) => ({ name: arr[0], meta: arr[1] }));

    const candidates = installed.filter(
      (automaton) =>
        this.#includeRegex.filter((pattern) =>
          automaton.name.match(new RegExp(pattern))
        ).length &&
        !this.#ignoreRegex.filter((pattern) =>
          automaton.name.match(new RegExp(pattern))
        ).length
    );

    const ignored = installed.filter(
      (automaton) =>
        this.#ignoreRegex.filter((pattern) =>
          automaton.name.match(new RegExp(pattern))
        ).length
    );

    const ret = deepFreeze({ 
      installed: installed.map(({name})=>({name:name,root:path.join(this.#root,name)})), 
      candidates: candidates.map(({name})=>({name:name,root:path.join(this.#root,name)})), 
      ignored: ignored.map(({name})=>({name:name,root:path.join(this.#root,name)}))});

    
      this.logger.log("verbose","output",ret);

      return ret;
    }
}

export default PluginLoader;
