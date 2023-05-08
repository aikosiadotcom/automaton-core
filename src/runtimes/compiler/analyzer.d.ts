export default Analyzer;
/**
 * ~AnalyzedImmutableProperties
 */
export type Analyzer = {
    file: string;
    manifest: Manifest;
};
/**
 * @typedef {object} Analyzer~AnalyzedImmutableProperties
 * @property {string} file
 * @property {Manifest} manifest
 */
/**
 * @typedef {PluginLoader~LoadedImmutablePlugin & Analyzer~AnalyzedImmutableProperties} Analyzer~AnalyzedImmutablePlugin
 */
/**
 * This class will do analysis on file manifest plugin and add some new properties
 * @category Runtimes
 * @subcategory Compiler
 *
 * @example
 *
 * import Analyzer from "./analyzer.js";
 *
 * const candidates = [{
 *      name: '@aikosia/automaton-bot-rest-example-01',
 *      root: path.normalize(`${__dirname}\/bots\/@aikosia\/automaton-bot-rest-example-01`)
 * }]
 * const analyzer = new Analyzer();
 * const result = await analyzer.run({candidates});
 * console.log(result);
 *
 * Console Terminal Output:
 * {
 *  name:"@aikosia/automaton-bot-rest-example-01",
 *  root:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01`),
 *  file:path.normalize(`${mockPath}\/mocks\/bots\/@aikosia\/automaton-bot-rest-example-01\/src\/index.js`),
 *  manifest:{
 *      "version": "1.0.0",
 *      "template": "rest",
 *      "profile": "default",
 *      "runParameter": "page",
 *      "cronjob": false
 *  }
 * }
 *
 * @extends App
 */
declare class Analyzer extends App {
    constructor();
    /**
     * Run the analysis
     * @param {object} options
     * @param {Array<PluginLoader~LoadedImmutablePlugin>} options.candidates
     *
     * @returns {Promise<Array<Analyzer~AnalyzedImmutablePlugin>>}
     *
     * @async
     */
    run({ candidates }: object): Promise<Array<Analyzer>>;
    #private;
}
import Manifest from "#runtime/manifest";
import App from "#src/app";