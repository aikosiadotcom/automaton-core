await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,Decorators} = await import('#core');

class AutomatonBotRestExample01 extends Automaton{
    constructor(){
        super({key:"AutomatonBotRestExample01"});
    }

    async run(page){
        console.log(`hi, jen! i am example-01 with cronjob ${this.manifest.cronjob} have been visited`);
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export const TestImmutability = "I Am Immutable";

export default AutomatonBotRestExample01;