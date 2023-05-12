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
export function dowhile(value: any, { kind, name }: {
    kind: any;
    name: any;
}): (...args: any[]) => Promise<void>;
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
export function delay(value: any, opts: any): ((...args: any[]) => Promise<any>) | ((_value: any, { kind, name }: {
    kind: any;
    name: any;
}) => (...args: any[]) => Promise<any>);
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
export function retry(value: any, opts: any): ((...args: any[]) => Promise<any>) | ((_value: any, { kind, name }: {
    kind: any;
    name: any;
}) => (...args: any[]) => Promise<any>);
