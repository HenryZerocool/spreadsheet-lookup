import React, { useState, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "./App.css";

function App() {
  //#region logging in
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');

  // function handleLogin(event) {
  //   event.preventDefault();
  //   console.log('Email:', username, 'Password: ', password);
  //   // You should see email and password in console.
  //   // ..code to submit form to backend here...
  // }
  //#endregion

  //#region gsAPI
  const [googleData, setGoogleData] = useState('');

  useEffect(() => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GS_ID}/values/TB!BX6%3ACA?majorDimension=COLUMNS&key=${process.env.REACT_APP_GS_API_KEY}`)
      .then(res => res.json())
      .then(setGoogleData);
  }, []);
  //#endregion

  const [lookupValue, setLookupValue] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [storage, setStorage] = useState('');
  const [buyinPrice, setBuyinPrice] = useState('');

  function handleLookup(lookupValue) {
    const indexOfLookup = googleData.values[0].indexOf(lookupValue);
    if (indexOfLookup >= 0) {
      setMeasurement(googleData.values[1][indexOfLookup]);
      setStorage(googleData.values[2][indexOfLookup]);
      setBuyinPrice(googleData.values[3][indexOfLookup]);
    }
  }

  if (googleData) {

    return (
      <div className="App">
        {
          //#region oldHeader 
          /* <header className="App-header">
          <p>
          Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          >
          Learn React
          </a>
          </header> */
          //#endregion
        }
        {
          //#region loginform
        /* <form onSubmit={handleLogin}>
          <TextField
            // required
            id="user-required"
            label="Future User"
            variant="outlined"
            name="username"
            value={username}
            onInput={e => setUsername(e.target.value)}
          />
          <TextField
            id="password-login"
            label="Password"
            type="password"
            // autoComplete="current-password"
            variant="outlined"
            name="password"
            value={password}
            onInput={e => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Log In
          </Button>
        </form> */ 
        //#endregion
        }
        <div>
          <Autocomplete
            id="lookup-input"
            value={lookupValue}
            onChange={(event, newLookupValue) => {
              setLookupValue(newLookupValue);
            }}
            onInputChange={(event, newLookupValue) => {
              handleLookup(newLookupValue);
            }}
            options={googleData.values[0]}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Input" variant="outlined" />
            )}
          /></div>
        <div>{`value: ${lookupValue !== null ? `'${lookupValue}'` : 'null'}`}</div>
        <div>{`measurement : '${measurement}'`}</div>
        <div>{`price per '${measurement}' : ${buyinPrice} 'VND'`}</div>
        <div>{`storage : ${storage} '${measurement}'`}</div>
      </div>
    );
  } else {
    return (
      <div>
        Loading
      </div>
    )
  }
}


export default App;
