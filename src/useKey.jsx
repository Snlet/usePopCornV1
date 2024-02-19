
import { useEffect } from "react";



export function useKey(key,action){

    useEffect(
        function () {

        
    function callback(event){
        if(event.code === key){
            action();
        }
    }


        document.addEventListener("keydown",callback(event));

return function(){
    document.removeEventListener("keydown",callback)
}
      },
       [action,key]
      
    );

}
