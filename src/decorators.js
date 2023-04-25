import wait from 'delay';
import pRetry from 'p-retry';
import Ability from './ability.js';

const logger = (new Ability({key:"Decorator"})).logger;

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

function delay(value,opts){
    if(opts != undefined && opts.kind == "method"){
        const min = 1;
        const max =  60;

        return async function (...args){
            await value.call(this,...args);
            console.log(`delay between ${min} - ${max}`);
            await wait.range(min*1000, max*1000);
        }
    }

    const {min,max} = value;
    return (_value,{kind,name})=>{
        if(kind == 'method'){
            return async function (...args){
                await _value.call(this,...args);
                console.log(`delay between ${min} - ${max}`);
                await wait.range(min*1000, max*1000);
            }
        }
    }
}

function retry(value,{kind,name}){
    if(kind == 'method'){
        return async function (...args) {
            await pRetry(()=>value.call(this,...args),{
                retries:2,
                onFailedAttempt: async error => {
                    logger.log("warn","retry",`Attempt ${error.attemptNumber} failed on method "${name}" with ${error.stack}. There are ${error.retriesLeft} retries left.`);
                    await wait.range(30000, 120000);
                },
                minTimeout:wait.range(30000, 120000)
            });
        }
    }
}

export {dowhile,delay,retry}