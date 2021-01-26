import React, { useState, useEffect } from "react";
import { TextField, Container } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from '@material-ui/core/styles';
import "./App.css";

const useStyles = makeStyles({
  primary1:{
    color: '#06c167'
  },
  lookup:{
    margin: '10px auto'
  },
  output: {
    margin: 5
  }
})

function App() {
  const classes = useStyles();
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

  function handleLookup(newLookupValue) {
    // handle null or empty input in console error
    if (!newLookupValue)
      newLookupValue = '';
    // only update look up if new input is entered
    if (newLookupValue.toString().trim().length > 0 && lookupValue !== newLookupValue){
      setLookupValue(newLookupValue);
      const indexOfLookup = googleData.values[0].indexOf(newLookupValue);
      if (indexOfLookup >= 0) {
        setMeasurement(googleData.values[1][indexOfLookup]);
        setStorage(googleData.values[2][indexOfLookup]);
        setBuyinPrice(googleData.values[3][indexOfLookup]);
      }
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
        <Container maxWidth="sm">
          <h1 className={classes.primary1}>Lookup / Tim kiem</h1>
          <div>
            <Autocomplete
              id="lookup-input"
              className={classes.lookup}
              value={lookupValue}
              onChange={(event, newLookupValue) => {
                handleLookup(newLookupValue);
              }}
              options={googleData.values[0]}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Search/Tu khoa" variant="outlined" />
              )}
            /></div>
          {/* <div>{`value: ${lookupValue !== null ? `'${lookupValue}'` : 'null'}`}</div> */}
          <TextField className={classes.output} id="name-output" label="Product name/Ten hang" value={lookupValue} variant="outlined" onChange={handleLookup(lookupValue)} />
          <TextField className={classes.output} id="measurement-output" label="Measurement/Don vi" value={measurement} variant="outlined" onChange={handleLookup(lookupValue)} />
          <TextField className={classes.output} id="buyin-price-output" label="Buyin price/Gia nhap" value={(buyinPrice * 1).toFixed(2) + ' VND'} variant="outlined" onChange={handleLookup(lookupValue)} />
          <TextField className={classes.output} id="sellling-price-output" label="Sellling price/Gia ban" value={(buyinPrice * 1.15).toFixed(2) + ' VND'} variant="outlined" onChange={handleLookup(lookupValue)} />
          <TextField className={classes.output} id="storage-output" label="Storage/Ton kho" value={storage + ' ' + measurement} variant="outlined" onChange={handleLookup(lookupValue)} />
        </Container>
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
