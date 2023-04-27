import wait from 'delay';
import pRetry from 'p-retry';
import Ability from './ability.js';
import random from 'random';

const logger = (new Ability({key:"Core",childKey:"Decorator"})).logger;

function dowhile(value,{kind,name}){
    if(kind == 'method'){
        return async function (...args) {
            let stop = false;
            let currentPage = 0;
            do{
                stop = await value.call(this,args[0],args[1],currentPage);
                currentPage++;
            }while(!stop);
        }
    }
}

async function _delay(opts = {}){
    const _min = opts.min ?? 30;
    const _max = opts.max ?? 60;
    const _meta = opts.meta ?? {};
    const _name = opts.name ?? "";

    const t = random.int(_min*1000,_max*1000);
    console.log(_name,_meta,`delay ${Math.ceil(t/1000)} seconds between ${_min} - ${_max}`);
    await delay(t);
}

function delay(value,opts){
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

function retry(value,opts){
    if(opts != undefined && opts.kind == "method"){
        return async function (...args) {
            await pRetry(()=>value.call(this,...args),{
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
                await pRetry(()=>_value.call(this,...args),{
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

export {dowhile,delay,retry}