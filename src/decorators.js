import wait from 'delay';
import pRetry from 'p-retry';
import App from '#src/app';
import random from 'random';

/**
 * All of this methods can only apply to method
 * 
 * @module Decorators
 * @category API
 */

const logger = (new App({key:"Core",childKey:"Decorators"})).logger;

/* c8 ignore start */
async function _delay(opts = {}){
    const _min = opts.min ?? 30;
    const _max = opts.max ?? 60;
    const _meta = opts.meta ?? {};

    const _name = opts.name ?? "";

    const t = random.int(_min*1000,_max*1000);
    console.log(_name,_meta,`delay ${Math.ceil(t/1000)} seconds between ${_min} - ${_max}`);
    await delay(t);
}
/* c8 ignore end */


/**
 * Function using this decorator will receives counter argument (value always start from 0) of the current looping.
 * 
 * @example
 * 
 * import Automaton,{Decorators} from '@aikosia/automaton-core';
 * 
 * class MyBot extends Automaton{
 *      constructor(){
 *          super({key:"MyBot"});
 *      }
 *      
 *      async run(page){
 *          await this.scrape(page);
 *      }
 * 
 *      Decorator.dowhile
 *      async scrape(page,currentPage){
 *          if(currentPage == 10){
 *              //will stop the execution
 *              return true;
 *          }
 * 
 *          await page.goto("https://google.com");         
 * 
 *          return false;
 *      }
 * }
 */
export function dowhile(value,{kind,name}){
    if(kind == 'method'){
        return async function (...args) {
            let stop = false;
            let currentPage = 0;
            do{
                stop = await value.call(this,...args,currentPage);
                currentPage++;
            }while(!stop);
        }
    }
}

/**
 * Delay execution
 * 
 * @param {object} [options]
 * @param {number} [options.min=30] - unit in seconds.
 * @param {number} [options.max=60] - unit in seconds
 * @param {object} [options.meta={}] - will be usefull for debug through logger
 * 
 * @example
 * 
 * import Automaton,{Decorators} from '@aikosia/automaton-core';
 * 
 * class MyBot extends Automaton{
 *      constructor(){
 *          super({key:"MyBot"});
 *      }
 *      
 *      Decorators.delay
 *      async run(page){
 *          await page.goto("https://google.com");
 *      }
 * 
 *      Decorator.delay({min:10,max:10,meta:{name:"MyBot"}})
 *      async scrape(){
 *          
 *      }
 * }
 */
export function delay(value,opts){
    if(opts != undefined && opts.kind == "method"){
        return async function (...args){
            await value.call(this,...args);
            await _delay({name:opts.name});
        }
    }

    const {min,max, meta} = value;
    return (_value,{kind,name})=>{
        if(kind == 'method'){
            return async function (...args){
                await _value.call(this,...args);
                await _delay({meta,min,max,name});
            }
        }
    }
}

/**
 * When there's an error happened, it will wait between 30-120 seconds to retry the first time. For the next (second,third,...) retry, it will wait between [options.min,options.max] value
 * 
 * @param {object} [options]
 * @param {number} [options.retries=2] - how many times to retries when there's an error exception happened
 * @param {number} [options.min=30] - unit in seconds.
 * @param {number} [options.max=60] - unit in seconds
 * @param {object} [options.meta={}] - will be usefull for debug through logger
 * 
 * @example
 * 
 * import Automaton,{Decorators} from '@aikosia/automaton-core';
 * 
 * class MyBot extends Automaton{
 *      constructor(){
 *          super({key:"MyBot"});
 *      }
 *      
 *      Decorators.retry
 *      async run(page){
 *          await page.goto("https://google.com");
 *      }
 * 
 *      Decorator.retry({min:10,max:10,retries:10,meta:{name:"MyBot"}})
 *      async scrape(){
 *          
 *      }
 * }
 */
export function retry(value,opts){
    if(opts != undefined && opts.kind == "method"){
        return async function (...args) {
            return await pRetry(async()=>await value.call(this,...args),{
                retries:2,
                onFailedAttempt: async error => {
                    logger.log("warn","retry",`Attempt ${error.attemptNumber} failed on method "${opts.name}" with ${error.stack}. There are ${error.retriesLeft} retries left.`);
                    await _delay({name:opts.name});
                },
                minTimeout:await wait.range(30000, 120000)
            });
        }
    }

    const {min,max, retries, meta} = value;
    return (_value,{kind,name})=>{
        if(kind == 'method'){
            return async function (...args) {
                return await pRetry(async()=>await _value.call(this,...args),{
                    retries: retries ?? 2,
                    onFailedAttempt: async error => {
                        logger.log("warn","retry",`Attempt ${error.attemptNumber} failed on method "${name}" with ${error.stack}. There are ${error.retriesLeft} retries left.`); 
                        await _delay({meta,min,max,name});
                    },
                    minTimeout:min*1000 ?? 30000
                });
            }
        }
    }
}
