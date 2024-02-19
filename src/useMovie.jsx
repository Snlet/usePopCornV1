import { useState ,useEffect } from "react";



var KEY = "b854366a";

export function useMovie(query){
    


    const [isError, setIsError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [movies, setMovies] = useState([]);

    useEffect(
        function () {
        
          const controller = new AbortController();
    
          async function fetchmoviedata() {
            try {
              setIsLoading(true);
              setIsError("");
              const res = await fetch(
                `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
                { signal: controller.signal }
              );
              
              if (!res.ok) {
                
                throw new Error(
                  "cannot fetch Movie, Check Your internet Connection"
                );
              }
              const data = await res.json();
              
              if (data.Response == "False") {
                throw new Error("Movie not found");
              }
    
              setMovies(data.Search);
            } catch (err) {
              if (err.message !== "The user aborted a request") {
                setIsError(err.message, "this err.message");
              }
              setIsError("");
              console.log(err.message);
            } finally {
              setIsLoading(false);
            }
          }
    
          if (query.length < 3) {
            setIsError("");
            setMovies([]);
            return;
          }
    
          fetchmoviedata();
    
          return function () {
            if (typeof data === "undefined") {
              controller.abort();
            }
          };
    
          // return function(){
          //   controller.abort();
          // }
        },
        [query]
      );

        return {isLoading,isError,movies}
      
}