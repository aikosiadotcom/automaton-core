await import('../../../../axios.js');
await import('../../../../playwright-core.js');

const {default:Automaton,decorators} = await import('#core');

class AutomatonPluginRestExample01 extends Automaton{
    constructor(){
        super({key:"AutomatonPluginRestExample01"});
    }

    async print({name}){
        return `Hello, ${name}`;
    }
}

export const TestImmutability = "I Am Immutable";

export default AutomatonPluginRestExample01;