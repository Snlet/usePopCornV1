import { useState,useEffect } from "react";

export function useLocalStorageState(initalState,key){

    const [value, setValue] = useState(function () {
        const storedData = localStorage.getItem(key);

        return storedData ?  JSON.parse(storedData) : initalState;
        
        // if(storedData) {return JSON.parse(storedData)}
        // else{return []}
      });


      useEffect(function(){  
        localStorage.setItem(key, JSON.stringify(value))
    },[value,key])

    return [value,setValue]


}