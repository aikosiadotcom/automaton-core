export default Manifest;
/**
 * File descriptor for bot created by automaton framework
 * @category Runtimes
 * @subcategory Compiler
 */
declare class Manifest {
    /**
     * Returns available value for this property
     * @type {Array<"1.0.0">}
     */
    static get version(): "1.0.0"[];
    /**
     * Returns available value for this property
     * @type {Array<"rest"|"crawler">}
     */
    static get template(): ("crawler" | "rest")[];
    /**
     * Returns available value for this property
     * @type {Array<'context'|'page'|'null'>}
     */
    static get runParameter(): ("page" | "context" | "null")[];
    /**
     * @async
     * @param {Manifest} manifest
     * @returns {boolean}
     * @throws If manifest not valid
     * @see https://www.npmjs.com/package/json-validator#usage--examples
     */
    static validate(manifest: Manifest): boolean;
    constructor({ version, template, profile, runParameter, cronjob }: {
        version: any;
        template: any;
        profile: any;
        runParameter: any;
        cronjob: any;
    });
    /**
     * @type {string}
     */
    version: string;
    /**
     * @type {string}
     */
    template: string;
    /**
     * @type {string}
     */
    profile: string;
    /**
     * @type {string}
     */
    runParameter: string;
    /**
     * @type {boolean | string}
     */
    cronjob: boolean | string;
}
