
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";


export default function App(){
    return (
      <Router>
          <Routes>
              <Route path="/confirmation" element={<Confirmation />}>
              </Route>
              <Route path="/error" element={<Error />}>
              </Route>
              <Route path="/joke" element={<Joke />}>
              </Route>
              <Route path="/" element={<Joke />}>
              </Route>
          </Routes>
      </Router>
    )
}
function Error(){
    return (
      <div className="error">
        <h1>Your subject or punchline is black. <Link to="/joke">Try again</Link></h1>
      </div>
    )
}
function Confirmation(){
    return (
      <div className="confirmation">
        <h1>Thanks for submitting your joke. <Link to="/joke">Add a Joke</Link></h1>
      </div>
    )
}


function Joke(){
  const navigate = useNavigate();
    const [joke, setJoke] = React.useState({subject: "", punchline:""})
    function handleTextChange(event) {
      const { name, value } = event.target
      setJoke((prevJoke)=>{
          return {...prevJoke, [name]: value}})
    }
  
    function postData(url = '', data = {}) {
      // Default options are marked with *
      if (data.subject.length<2 || data.punchline.length<2){
        navigate('/error');
        return 

      }
      else {
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          })
          .then(res=>{
            if (!res.ok) {
              return res.text().then(text => { throw new Error(text) });
            }
            else {
              return res.text().then(text=>{
                
                navigate('/confirmation');
                
              });
            }
          })
          .catch(error=>{
            console.log('error', error);
        });
      }
      
    }
    
    function clickHandler(event) {
        event.preventDefault();
      const {subject, punchline} = joke;
      return postData('/addJoke', {subject, punchline});
    }
            
    return ( 
      <div className="form-container">
        <form>
          <label>Knock knock!</label>
          <label htmlFor="subject">Who's there?</label>
          <input className="form-subject" type="text" name="subject" placeholder="Banana" value={joke.subject} onChange={handleTextChange}></input>
          <label htmlFor="punchline">{!joke.subject.length?"...":joke.subject} who?</label>
          <input className="form-punchline" type="text" name="punchline" placeholder="Banana messages for me?" value={joke.punchline} onChange={handleTextChange}></input>
          <button className="form-button" onClick={clickHandler}>Submit</button>
        </form>
      </div>
    )
}