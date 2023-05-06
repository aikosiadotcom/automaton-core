export default Manifest;
/**
 * ~Schema
 */
export type Manifest = {
    /**
     * ~SchemaVersion} version
     */
    "": Manifest;
    profile: string;
    cronjob: boolean | string;
};
/**
* @typedef {object} Manifest~Schema
* @property {Manifest~SchemaVersion} version
* @property {Manifest~SchemaTemplate} template
* @property {string} profile
* @property {Manifest~SchemaRunParameter} runParameter
* @property {boolean | string} cronjob
 */
/**
 * @typedef {"1.0.0"} Manifest~SchemaVersion
 */
/**
 * @typedef {"rest" | "crawler"} Manifest~SchemaTemplate
 */
/**
 * @typedef {'context' | 'page' | 'null'} Manifest~SchemaRunParameter
 */
/**
 * File descriptor for bot created by automaton framework
 * @category Runtimes
 * @subcategory Compiler
 */
declare class Manifest {
    /**
     * Returns available value for this property
     * @type {Array<Manifest~SchemaVersion>}
     */
    static get version(): Manifest[];
    /**
     * Returns available value for this property
     * @type {Array<Manifest~SchemaTemplate>}
     */
    static get template(): Manifest[];
    /**
     * Returns available value for this property
     * @type {Array<Manifest~SchemaRunParameter>}
     */
    static get runParameter(): Manifest[];
    /**
     * @async
     * @param {Manifest} manifest
     * @returns {boolean}
     * @throws If manifest not valid
     * @see https://www.npmjs.com/package/json-validator#usage--examples
     */
    static validate(manifest: Manifest): boolean;
    /**
     * @param {Manifest~Schema}
     */
    constructor({ version, template, profile, runParameter, cronjob }: Manifest);
    /**
     * @type {Manifest~SchemaVersion}
     */
    version: Manifest;
    /**
     * @type {Manifest~SchemaTempalte}
     */
    template: Manifest;
    /**
     * @type {string}
     */
    profile: string;
    /**
     * @type {Manifest~SchemaRunParameter}
     */
    runParameter: Manifest;
    /**
     * @type {boolean | string}
     */
    cronjob: boolean | string;
    /**
     * @returns {Manifest~Schema}
     */
    toObject(): Manifest;
}
