

function Button(){
  const [joke, setJoke] = React.useState({subject: "", punchline:""})
  function handleTextChange() {
    setJoke((prevJoke)=>{
        return {...prevJoke, [event.target.name]: event.target.value}})
  }

  function postData(url = '', data = {}) {
    // Default options are marked with *
    
    fetch(url, {
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
        return res.text().then(text => { throw new Error(text) })
      }
      else {
        return res.text().then(text=>console.log(text));
      }
    })
    .catch(error=>{
      console.log('error', error);
  });
  
  }
  
   function clickHandler(data={}) {
    const {subject, punchline} = data;
    postData('https://d796-47-147-243-114.ngrok.io/addJoke', {subject, punchline});
  }
          
  return ( 
    <div className="form-container">
      <form>
        <label>Knock knock!</label>
        <label htmlFor="subject">Who's there?</label>
        <input className="form-subject" type="text" name="subject" placeholder="Banana" value={joke.subject} onChange={handleTextChange}></input>
        <label htmlFor="punchline">{!joke.subject.length?"...":joke.subject} who?</label>
        <input className="form-punchline" type="text" name="punchline" placeholder="Banana messages for me?" value={joke.punchline} onChange={handleTextChange}></input>
        <button className="form-button" onClick={(event)=>{event.preventDefault();clickHandler(joke)}}>Submit</button>
      </form>
    </div>
  )
}


const container = document.getElementById("form_container");
const root = ReactDOM.createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Button />);

