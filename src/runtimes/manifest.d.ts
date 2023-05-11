export default Manifest;
/**
 * File descriptor for bot created by automaton framework
 * @category Runtimes
 * @subcategory Compiler
 */
declare class Manifest {
    /**
     * Returns available value for this property
     * @type {Array<string>}
     */
    static get version(): string[];
    /**
     * Returns available value for this property
     * @type {Array<string>}
     */
    static get template(): string[];
    /**
     * Returns available value for this property
     * @type {Array<string>}
     */
    static get runParameter(): string[];
    /**
     * @async
     * @param {Manifest | Manifest~Schema} manifest
     * @returns {Promise<boolean>}
     * @throws If manifest not valid
     * @see https://www.npmjs.com/package/json-validator#usage--examples
     */
    static validate(manifest: any): Promise<boolean>;
    /**
     *
     * @param {undefined | object} [options]
     * @param {string} [options.cwd=process.cwd()]
     */
    static get(options?: undefined | object): Promise<any>;
    /**
    * @typedef {object} Manifest~Schema
    * @property {"1.0.0"} version
    * @property {"rest" | "crawler"} template
    * @property {string} profile
    * @property {'context' | 'page' | 'null'} runParameter
    * @property {boolean | string} cronjob
    */
    /**
     * @param {(Manifest~Schema)}
     */
    constructor({ version, template, profile, runParameter, cronjob }: (Manifest));
    /**
     * @type {"1.0.0"}
     */
    version: "1.0.0";
    /**
     * @type {"rest" | "crawler"}
     */
    template: "rest" | "crawler";
    /**
     * @type {string}
     */
    profile: string;
    /**
     * @type {'context' | 'page' | 'null'}
     */
    runParameter: 'context' | 'page' | 'null';
    /**
     * @type {boolean | string}
     */
    cronjob: boolean | string;
    /**
     * @returns {(Manifest~Schema)}
     */
    toObject(): (Manifest);
}
