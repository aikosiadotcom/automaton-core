await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,Decorators} = await import('#core');

class AutomatonBotRestExample06 extends Automaton{
    constructor(){
        super({key:"AutomatonBotRestExample06"});
    }

    async run(page){
        console.log(`hi, jen! i am example-05 with cronjob ${this.manifest.cronjob} and throw error have been visited`);
        throw new Error("i am error");
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonBotRestExample06