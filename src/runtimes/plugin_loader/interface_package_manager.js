import AbstractClassError from "#error/abstract_class_error";

class InterfacePackageManager{
     constructor(){
          if(this.constructor === InterfacePackageManager){
               throw new AbstractClassError();
          }
     }

     root(){
          //implementation
     }
     ls(){
          //implementation
     }
}

export default InterfacePackageManager