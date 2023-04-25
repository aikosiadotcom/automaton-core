import prettyHrtime from 'pretty-hrtime';

/** 
 * @typedef {Object} ProfilerResult
 * @property {string} name
 * @property {number} time
 * @property {string} words
 * @property {string} preciseWords
 * @property {string} verboseWords
*/

/**
 * @callback CallbackLoggerInstance
 * @param {ProfilerResult} data
 */

/**
 * measure execution time
 */
class Profiler{
  namedPerformances = {};
  defaultName = "default";

  /**
   * 
   * @param {CallbackLoggerInstance} logInstance 
   */
  constructor(logInstance){
    this.logInstance = logInstance;
  }

  /**
   * start measure
   * 
   * @param {string} name 
   */
  start(name){
    name = name || this.defaultName;
    this.namedPerformances[name] = {
      startAt: process.hrtime(),
    }
  }
  
  /**
   * stop measure
   * 
   * @param {string} name 
   * @returns ProfilerResult
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
