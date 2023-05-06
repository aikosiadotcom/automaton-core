await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,Decorators} = await import('#core');

class AutomatonPluginRestExample06 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample06"});
    }

    async run(page){
        console.log(`hi, jen! i am example-05 with cronjob ${this.manifest.cronjob} and throw error have been visited`);
        throw new Error("i am error");
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonPluginRestExample06