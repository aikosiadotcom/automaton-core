export default Profiler;
/**
 * ~ExecutionTimeReport
 */
export type Profiler = {
    name: string;
    time: number;
    words: string;
    preciseWords: string;
    verboseWords: string;
};
/**
 * @typedef {Object} Profiler~ExecutionTimeReport
 * @property {string} name
 * @property {number} time
 * @property {string} words
 * @property {string} preciseWords
 * @property {string} verboseWords
*/
/**
 * @callback Profiler~ReportHandler
 * @param {Profiler~ExecutionTimeReport} report
 */
/**
 * Contains methods to measure of the time required to execute a task
 * @category Features
 * @subcategory Feature
 * @example <caption>default usage</caption>
 *
 * const profiler = new Profiler();
 *
 * @example <caption>optional usage</caption>
 *
 * function reportHandler(report){
 *    console.log("report",report);
 * }
 *
 * const profiler = new Profiler(reportHandler);
 */
declare class Profiler {
    /**
     * @param {Profiler~ReportHandler} [reportHandler] - a handler to process the report
     */
    constructor(reportHandler: any);
    namedPerformances: {};
    defaultName: string;
    logInstance: any;
    /**
     * @description
     * start measure
     *
     * @example <caption>default usage</caption>
     * profiler.start();
     *
     * @example <caption>optional usage</caption>
     *
     * if there are multiple task, then you shall pass parameter name to distinct it.
     *
     * profiler.start("bootstrapTask");
     *
     * @param {string} [name="default"] - start the measurement
     */
    start(name?: string): void;
    /**
     * @description
     * stop measure
     *
     * @example <caption>default usage</caption>
     * const report = profiler.stop();
     *
     * @example <caption>optional usage</caption>
     *
     * parameter name will be using to collect the report of a task
     *
     * const report = profiler.stop("bootstrapTask");
     *
     * @param {string} [name="default"] - stop the measurement and collect the report.
     *
     * @returns {Profiler~ExecutionTimeReport}
     */
    stop(name?: string): Profiler;
}
