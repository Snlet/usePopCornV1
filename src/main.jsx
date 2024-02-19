import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Appcopy1 from './Appcopy1.jsx'
import App_movieselecte from './App_movieselecte.jsx'
import './index.css'
import Stars from './Stars.jsx'
import StarRating from './Stars.jsx'
import App_movieselect_noaddduplicate from './App_movieselect_noaddduplicate.jsx'
import App_movieselect_noaddduplicate_exploremorehooks from './App_movieselect_noaddduplicate_exploremorehooks.jsx'


function Test(){
 
  const [r , setr] = useState(0)
  return(
    <div>
      <StarRating maxRating={10} color='blue' setra={setr} />
      <p>This movie is rated {r} by You!</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
   <App_movieselect_noaddduplicate_exploremorehooks/>
   {/* <App_movieselecte/> */}
    {/* <Stars /> */}
 </React.StrictMode>, 
)

// {/* <Stars maxRating = {3} defaultRating= {2}/>
// <Stars color='red' messages = {['terrible','bad','okay','good','excelent']}/>
// <Test /> */}
