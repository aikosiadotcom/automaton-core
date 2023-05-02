await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,decorators} = await import('#core');

class AutomatonPluginRestExample04 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample04"});
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}