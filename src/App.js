import React, { useState, useEffect } from "react";
import { TextField, Container, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as jwt from "jsonwebtoken";
import { makeStyles } from '@material-ui/core/styles';
import "./App.css";

const useStyles = makeStyles({
  primary1: {
    color: '#06c167'
  },
  lookup: {
    margin: '10px auto'
  },
  output: {
    margin: 5
  }
})

function App() {
  const classes = useStyles();
  //#region logging in
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let token, isLogin;

  function handleLogin(event) {
    event.preventDefault();
    if (password.toUpperCase() === process.env.REACT_APP_PASSWORD1) {
      token = jwt.sign({ magic_password: process.env.REACT_APP_PASSWORD1 }, process.env.REACT_APP_JWT_KEY);
      localStorage.setItem('magic_token', token);
      console.log('Email:', username, 'Password:', password, 'localStorage', !localStorage.magic_token);
    } else {
      // TODO snack bar for incorrect login
    }
  }

  //TODO: check if user's token is valid
  function checkLogin() {
    if (!localStorage.magic_token){
      console.log('no local storage');
      isLogin = false;
    }
    else {
      jwt.verify(localStorage.magic_token, process.env.REACT_APP_JWT_KEY, (err, decode) => {
        if (err) {
          isLogin = false;
          console.log('err', err);
        }
        else if (decode && decode.magic_password === process.env.REACT_APP_PASSWORD1) {
          isLogin = true;
        }
      });
      console.log('islogin', isLogin);
    }
  }
  //#endregion

  //#region gsAPI
  // const [googleDataTB, setGoogleDataTB] = useState('');
  // const [googleDataCD, setGoogleDataCD] = useState('');

  // useEffect(() => {
  //   fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GS_ID}/values/TB!BX6%3ACA?majorDimension=COLUMNS&key=${process.env.REACT_APP_GS_API_KEY}`)
  //     .then(res => res.json())
  //     .then(setGoogleDataTB);
  // }, []);
  // useEffect(() => {
  //   fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GS_ID}/values/CD!BX6%3ACA?majorDimension=COLUMNS&key=${process.env.REACT_APP_GS_API_KEY}`)
  //     .then(res => res.json())
  //     .then(setGoogleDataCD);
  // }, []);
  //#endregion

  const [lookupValue, setLookupValue] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [buyinPrice, setBuyinPrice] = useState('');
  const [storageTB, setStorageTB] = useState('');
  const [storageCD, setStorageCD] = useState('');

  // function handleLookup(newLookupValue) {
  //   // handle null or empty input in console error
  //   if (!newLookupValue)
  //     newLookupValue = '';
  //   // only update look up if new input is entered
  //   if (newLookupValue.toString().trim().length > 0 && lookupValue !== newLookupValue){
  //     setLookupValue(newLookupValue);
  //     const indexOfLookupTB = googleDataTB.values[0].indexOf(newLookupValue);
  //     if (indexOfLookupTB >= 0) {
  //       setMeasurement(googleDataTB.values[1][indexOfLookupTB]);
  //       setBuyinPrice(googleDataTB.values[3][indexOfLookupTB]);
  //       setStorageTB(googleDataTB.values[2][indexOfLookupTB]);
  //     }
  //     const indexOfLookupCD = googleDataCD.values[0].indexOf(newLookupValue);
  //     if (indexOfLookupCD >= 0) {
  //       setStorageCD(googleDataCD.values[2][indexOfLookupCD]);
  //     }
  //   }
  // }

  // if (googleDataTB && googleDataCD) {

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
        <form onSubmit={handleLogin}>
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
            autoComplete="current-password"
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
          <Button
            // type="button"
            onClick={checkLogin}
            variant="contained"
            color="primary"
          >
            checkLogin
            </Button>
        </form>
        //#endregion
      }
      <Container maxWidth="sm">
        <h1 className={classes.primary1}>Lookup / Tim kiem</h1>
        {/* <div>
            <Autocomplete
              id="lookup-input"
              className={classes.lookup}
              value={lookupValue}
              onChange={(event, newLookupValue) => {
                handleLookup(newLookupValue);
              }}
              options={googleDataTB.values[0]}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Search/Tu khoa" variant="outlined" />
              )}
            /></div> */}
        {/* <div>{`value: ${lookupValue !== null ? `'${lookupValue}'` : 'null'}`}</div> */}
        {/* <div><TextField className={classes.output} id="name-output" label="Product name/Ten hang" value={lookupValue} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="measurement-output" label="Measurement/Don vi" value={measurement} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="buyin-price-output" label="Buyin price/Gia nhap" value={(buyinPrice * 1).toFixed(2) + ' VND'} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="sellling-price-output" label="Sellling price/Gia ban" value={(buyinPrice * 1.15).toFixed(2) + ' VND'} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="storageTB-output" label="StorageTB/Ton kho TB" value={storageTB * 1 + ' ' + measurement} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="storageCD-output" label="StorageCD/Ton kho CD" value={storageCD * 1 + ' ' + measurement} variant="outlined" onChange={handleLookup(lookupValue)} /></div> */}
      </Container>
    </div>
  );
  // } else {
  //   return (
  //     <div>
  //       Loading
  //     </div>
  //   )
  // }
}


export default App;
