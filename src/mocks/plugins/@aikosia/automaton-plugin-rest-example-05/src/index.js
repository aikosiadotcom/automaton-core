await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,decorators} = await import('#core');

class AutomatonPluginRestExample05 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample05"});
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export default AutomatonPluginRestExample05