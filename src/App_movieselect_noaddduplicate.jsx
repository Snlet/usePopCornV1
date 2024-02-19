import { useEffect, useState } from "react";
import Stars from "./Stars";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

var KEY = "b854366a";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [movieId, setMovieId] = useState(null);
  

  //   console.log("app rendered querry value", query, " movieid value ", movieId);

  // const tempquerry= query

  /*useEffect(function(){
    console.log('with no dependencies')
  })

  useEffect(function(){
    console.log('with dependency')
  },[])
  useEffect(function(){
    console.log("run when query is updated")
  },[query])

  console.log("render");*/

  function handleSelectedMovie(id) {
    {
      movieId == id ? setMovieId(null) : setMovieId(id);
    }
  }
  function closeMovieDetails() {
    setMovieId(null);
  }
  function handlesavedmovie(movie) {
    // console.log("in the app handlemovie component");
    setWatched((watched) => [...watched, movie]);
    // console.log(watched);
  }

  function handleDeleteWatched(id){
    setWatched((watched) => watched.filter((movie)=>
    movie.imdbID !== id))
  }
  
  useEffect(function(){
    document.addEventListener("keydown",event=>{
      console.log(event.key)
      if(event.key == 'Escape'){
        closeMovieDetails()
      }
    })
  },[])

  useEffect(
    function () {

      // const controller = new AbortController();
      const controller = new AbortController();

      async function fetchmoviedata() {
        try {
          setIsLoading(true);
          setIsError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}` , {signal:controller.signal}
          );
          // , {signal:controller.signal} line-104,113, cleanup function **
          // console.log(res.ok)
          if (!res.ok) {
            // console.log('there is error')
            throw new Error(
              "cannot fetch Movie, Check Your internet Connection"
            );
          }
          const data = await res.json();
          // console.log(data)
          if (data.Response == "False") {
            throw new Error("Movie not found");
          }

          setMovies(data.Search);


        } catch (err) {
          
          if(err.message !== 'The user aborted a request'){

            setIsError(err.message , "this err.message");
          }
          setIsError("")
          console.log(err.message)
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

      return function(){
        if(typeof data === 'undefined'){
          controller.abort()
        }
      }

      // return function(){
      //   controller.abort();
      // }
    },
    [query]
  );

  return (
    <>
      <NavBar movies={movies}>
        <Input query={query} setQuery={setQuery} />
        {movies ? <NumResults movies={movies} /> : null}
      </NavBar>

      <Menu>
        <Box>
          {isLoading && <Loader />}
          {isError && <Errcomp message={isError} />}
          {!isLoading && !isError && (
            <MovieList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
            />
          )}
        </Box>

        <Box>
          {movieId ? (
            <>
              <CloseMovieDetail closeMovieDetails={closeMovieDetails} />
              <MovieDetails
                movieId={movieId}
                handlesavedmovie={handlesavedmovie}
                closeMovieDetails={closeMovieDetails}
                watched= {watched}
              />
            </>
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} handleDeleteWatched={handleDeleteWatched}/>
            </>
          )}
        </Box>
      </Menu>
    </>
  );
}

function CloseMovieDetail({ closeMovieDetails }) {
  return (
    <div>
      <p className="back-btn" onClick={closeMovieDetails}>
        &larr;
      </p>
    </div>
  );
}
function MovieDetails({
  movieId,
  handlesavedmovie,
  closeMovieDetails,
  watched
  
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [userRating, setUserRating] = useState("");
  
    const isWatched = watched.map(movie => movie.imdbID).includes(movieId)
    const watchedUserRating = watched.find((movie)=>movie.imdbID === movieId)?.userRating
  const {
    Title: title,
    Runtime: runtime,
    Year: year,
    Poster: poster,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function addmovie() {
    const newWatchedMovie = {
      imdbID: movieId,
      title,
      poster,
      runtime,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    handlesavedmovie(newWatchedMovie);
    closeMovieDetails();
  }

  useEffect(
    function () {
      async function gettingmovieobject() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${movieId}`
          );

          if (!res.ok) {
            console.log("throwing new exception");
            throw new Error("Failed to fetch Movie detail");
          }

          const data = await res.json();

          setMovie(data);
        } catch (err) {
          setIsError(err.message);
          console.log(isError);
        } finally {
          setIsLoading(false);
        }
      }
      gettingmovieobject();
    },
    [movieId]
  );


useEffect(function(){
    if(!title) return
    document.title  = `Movie | ${title}`

  return function(){
    document.title = "usePopcorn"
    console.log(`clean up effect for movie ${title}`)
  }
},[title])



  return (
    <>
      {isLoading && <Loader />}
      {isError && <Errcomp message={isError} />}
      {!isLoading && !isError && (
        <div className="details">
          <h2>Hari Om Bapu</h2>
          <header>
            <img width="33%" src={poster} alt={`Poster of ${movie}`} />
            <div className="detail-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} imDB Rating
              </p>
            </div>
          </header>
          <section>

            {!isWatched ? 
                <div className="rating">
                    <Stars maxRating={10} size={23} onSetRating={setUserRating} />
                </div>
                :
                <p>You reated this movie {watchedUserRating} 🌟</p>
            }
         
            {userRating && (
                <button className="btn-add" onClick={() => addmovie(movie)}>
                Add movie
                </button>
                )}

            <p>
              <em>{plot}</em>
            </p>
            <p>Starting {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </div>
      )}
    </>
  );
}
function Errcomp({ message }) {
  return (
    <>
      <h1 className="loading">❌{message}</h1>
    </>
  );
}
function Loader() {
  return <div className="loading">Loading...</div>;
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      {children}
    </nav>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies == undefined ? 0 : movies.length}</strong> results
    </p>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Input({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function Menu({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieList({ movies, handleSelectedMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectmovie={handleSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectmovie }) {
  return (
    <li
      key={movie.imdbID}
      className="moviesection"
      onClick={() => onSelectmovie(movie.imdbID)}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
// function WatchedBox(){

//   return (
//     <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             <>

//             </>
//           )}
//         </div>
//   )
// }
function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => Number(movie.imdbRating))
  );
  const avgUserRating = average(
    watched.map((movie) => Number(movie.userRating))
  );
  const avgRuntime = average(
    watched.map((movie) => Number(movie.runtime).toFixed(2))
  );
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieList({ watched ,handleDeleteWatched}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <MovieWatched movie={movie} key={movie.imdbID} handleDeleteWatched={handleDeleteWatched}/>
      ))}
    </ul>
  );
}
function MovieWatched({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min </span>
        </p>

        <button className="btn-delete" onClick={()=>handleDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li>
  );
}
