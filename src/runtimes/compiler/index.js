import App from "#src/app";
import Analyzer from "#compiler/analyzer";
import Generator from "#compiler/generator";

class Compiler extends App{
    #analyzer;
    #generator;

    constructor(){
        super({key:"Core",childKey:"Compiler"});
        this.#analyzer = new Analyzer();
        this.#generator = new Generator();
    }
    
    async run({automata}){
        const analyzerResult = await this.#analyzer.run({candidates:automata});
        const generatorResult = await this.#generator.run({candidates:analyzerResult});

        return generatorResult;
    }
}

export default Compiler;