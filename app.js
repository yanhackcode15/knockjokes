//convert to standard react with bundler and fix the randomizer to count the total, i don't have IDs in all jokes in firestore and add a buton on other route
const container = document.getElementById("app");
const root = ReactDOM.createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

function App(){
    return (
        <ReactRouterDOM.HashRouter>
            <ReactRouterDOM.Route path="/" exact component={Joke} />
            <ReactRouterDOM.Route path="/confirmation" component={Confirmation} />
            <ReactRouterDOM.Route path="/error" component={ErrorPage} />
            <ReactRouterDOM.Route path="/joke" component={Joke} />
        </ReactRouterDOM.HashRouter>
        
    )
}
function ErrorPage(){
    return (
        <div>
            <h1>Your subject or punchline is black. Try again</h1>
            <Button>
                <ReactRouterDOM.Link to="/joke">
                New Joke
                </ReactRouterDOM.Link>
            </Button>
        </div>
    )
}
function Confirmation(){
    return (
        <div>confirm</div>
    )
}
function Joke(){
    const [joke, setJoke] = React.useState({subject: "", punchline:""})
    function handleTextChange() {
      setJoke((prevJoke)=>{
          return {...prevJoke, [event.target.name]: event.target.value}})
    }
  
    function postData(url = '', data = {}) {
      // Default options are marked with *
      if (data.subject.length<2 || data.punchline.length<2){
        window.location.href = '/posterror';
        // <ReactRouterDOM.Redirect to="/" />
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
                console.log(text);
                window.location.href = '/confirm';
                // return <ReactRouterDOM.Redirect to="/confirmation"/>
              });
            }
          })
          .catch(error=>{
            console.log('error', error);
        });
      }
      
    }
    
    function clickHandler(data={}) {
      const {subject, punchline} = data;
      return postData('addJoke', {subject, punchline});
    }
            
    return ( 
      <div className="form-container">
        <form>
          <label>Knock knock!</label>
          <label htmlFor="subject">Who's there?</label>
          <input className="form-subject" type="text" name="subject" placeholder="Banana" value={joke.subject} onChange={handleTextChange}></input>
          <label htmlFor="punchline">{!joke.subject.length?"...":joke.subject} who?</label>
          <input className="form-punchline" type="text" name="punchline" placeholder="Banana messages for me?" value={joke.punchline} onChange={handleTextChange}></input>
          <button className="form-button" onClick={(event)=>{event.preventDefault();return clickHandler(joke)}}>Submit</button>
        </form>
      </div>
    )
}
