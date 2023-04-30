import path from "path";
import mockAbility from "./ability.js";
import { resolveDirname } from "../system.js";
const __dirname =  resolveDirname(import.meta.url);
await mockAbility(path.join(__dirname,".."),{showLog:false});

const {decorators} = await import("../index.js");
class DecoratorTest{
    counter = 0;
    innerRetry = 0;
    constructor(){
    }

    @decorators.dowhile
    async dowhile1(currentPage,...args){
        if(currentPage == 4){
            return true;
        }

        this.counter++;
        return false;
    }

    @decorators.delay
    async delay1(args){
    }

    @decorators.delay({min:1,max:1,meta:"hi, jen !"})
    async delay2(args){
        this.innerMethod();
    }

    @decorators.retry
    async retry1(){
        this.innerRetry++;

        if(this.innerRetry == 2){
            return "hi, firman !";
        }
        throw new Error("hello world");
    }

    @decorators.retry({min:1,max:1,meta:"hi, firman !"})
    async retry2(){
        throw new Error("hello world");
    }

    async innerMethod(){
        console.log("test this");
    }
}
export default DecoratorTest;