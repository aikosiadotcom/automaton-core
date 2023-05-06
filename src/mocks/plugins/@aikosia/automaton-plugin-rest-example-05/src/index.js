await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,Decorators} = await import('#core');

class AutomatonPluginRestExample05 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample05"});
    }

    async run(page){
        console.log(`hi, jen! i am example-05 with cronjob ${this.manifest.cronjob} have been visited`);
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonPluginRestExample05