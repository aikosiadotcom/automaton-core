import prettyHrtime from 'pretty-hrtime';

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
class Profiler{
  namedPerformances = {};
  defaultName = "default";
  /**
   * @param {Profiler~ReportHandler} [reportHandler] - a handler to process the report
   */
  constructor(reportHandler){
    this.logInstance = reportHandler;
  }

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
  start(name){
    name = name || this.defaultName;
    this.namedPerformances[name] = {
      startAt: process.hrtime(),
    }
  }
  
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
  stop(name){
    name = name || this.defaultName;
    const startAt = this.namedPerformances[name] && this.namedPerformances[name].startAt;
    if(!startAt) throw new Error('Namespace: '+name+' doesnt exist');
    const diff = process.hrtime(startAt);
    const time = diff[0] * 1e3 + diff[1] * 1e-6;
    const words = prettyHrtime(diff);
    const preciseWords = prettyHrtime(diff, {precise:true});
    const verboseWords = prettyHrtime(diff, {verbose:true});

    const ret = {
        name: name,
        time: time,
        words: words,
        preciseWords: preciseWords,
        verboseWords: verboseWords
    };

    if (this.logInstance) {
      this.logInstance(ret);
    }
    
    return ret;
  }
}

export default Profiler;
