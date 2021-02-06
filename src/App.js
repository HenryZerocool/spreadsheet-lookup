import React, { useState, useEffect } from "react";
import { TextField, Container, Button, Snackbar } from "@material-ui/core";
// import from '@material-ui/core/Snackbar';
import Autocomplete from "@material-ui/lab/Autocomplete";
import MuiAlert from '@material-ui/lab/Alert';
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

// Snackbar's Alert config
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const classes = useStyles();
  //#region logging in
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [open, setOpen] = useState(false);
  let token;

  // login button click
  function handleLogin(event) {
    event.preventDefault();
    if (password.toUpperCase() === process.env.REACT_APP_PASSWORD1) {
      token = jwt.sign({ magic_password: process.env.REACT_APP_PASSWORD1 }, process.env.REACT_APP_JWT_KEY);
      localStorage.setItem('magic_token', token);
      setIsLogin(true);
      setIsLoading(true);
    } else {
      setOpen(true);
    }
  }

  // close snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // call when app is open
  function checkLogin() {
    if (!localStorage.magic_token) {
      console.log('no local storage');
      setIsLogin(false);
      setIsLoading(false);
    }
    else {
      jwt.verify(localStorage.magic_token, process.env.REACT_APP_JWT_KEY, (err, decode) => {
        if (err) {
          setIsLogin(false);
          setIsLoading(false);
          console.log('err', err);
        }
        else if (decode && decode.magic_password === process.env.REACT_APP_PASSWORD1) {
          setIsLoading(false);
          setIsLogin(true);
        }
      });
    }
    console.log('islogin', isLogin);
  }

  // works like component did mount
  useEffect(() => {
    setIsLoading(true);
    checkLogin();
    console.log('check login in use effect called');
  }, []);

  //#endregion

  //#region gsAPI
  const [googleDataTB, setGoogleDataTB] = useState('');
  const [googleDataCD, setGoogleDataCD] = useState('');

  useEffect(() => {
    if (isLogin && !googleDataTB) {
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GS_ID}/values/TB!BX6%3ACA?majorDimension=COLUMNS&key=${process.env.REACT_APP_GS_API_KEY}`)
        .then(res => res.json())
        .then(setGoogleDataTB);
    }
  }, [isLogin]);
  useEffect(() => {
    if (isLogin && !googleDataCD) {
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GS_ID}/values/CD!BX6%3ACA?majorDimension=COLUMNS&key=${process.env.REACT_APP_GS_API_KEY}`)
        .then(res => res.json())
        .then(setGoogleDataCD)
        .then(setIsLoading(false));
    }
  }, [isLogin]);
  //#endregion

  const [lookupValue, setLookupValue] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [buyinPrice, setBuyinPrice] = useState('');
  const [storageTB, setStorageTB] = useState('');
  const [storageCD, setStorageCD] = useState('');

  function handleLookup(newLookupValue) {
    // handle null or empty input in console error
    if (!newLookupValue)
      newLookupValue = '';
    // only update look up if new input is entered
    if (newLookupValue.toString().trim().length > 0 && lookupValue !== newLookupValue) {
      setLookupValue(newLookupValue);
      const indexOfLookupTB = googleDataTB.values[0].indexOf(newLookupValue);
      if (indexOfLookupTB >= 0) {
        setMeasurement(googleDataTB.values[1][indexOfLookupTB]);
        setBuyinPrice(googleDataTB.values[3][indexOfLookupTB]);
        setStorageTB(googleDataTB.values[2][indexOfLookupTB]);
      }
      const indexOfLookupCD = googleDataCD.values[0].indexOf(newLookupValue);
      if (indexOfLookupCD >= 0) {
        setStorageCD(googleDataCD.values[2][indexOfLookupCD]);
      }
    }
  }

  if (isLoading) {
    return (
      <div>
        <h3 className={classes.primary1}>Loading</h3>
      </div>
    )
  }
  else if (!isLogin) {
    return (
      <div className="App">
        <h1 className={classes.primary1}>Lookup / Tim kiem</h1>
        <form onSubmit={handleLogin}>
          {/* <div>
              
            <TextField
              // required
              id="user-required"
              label="Future User"
              variant="outlined"
              name="username"
              value={username}
              onInput={e => setUsername(e.target.value)}
              />
              </div> */}
          <div>
            <TextField
              required
              id="password-login"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              name="password"
              value={password}
              onInput={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button
              className={classes.lookup}
              type="submit"
              variant="contained"
              color="primary"
            >
              Log In
            </Button>
          </div>
          <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                Wrong password!
              </Alert>
            </Snackbar>
          </div>
        </form>
      </div>
    );
  }
  else if (isLogin && googleDataTB && googleDataCD) {
    return (
      <div className="App">
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
              options={googleDataTB.values[0]}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Search/Tu khoa" variant="outlined" />
              )}
            /></div>

          {/* <div>{`value: ${lookupValue !== null ? `'${lookupValue}'` : 'null'}`}</div> */}
          <div><TextField className={classes.output} id="name-output" label="Product name/Ten hang" value={lookupValue} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="measurement-output" label="Measurement/Don vi" value={measurement} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="buyin-price-output" label="Buyin price/Gia nhap" value={(buyinPrice * 1).toFixed(2) + ' VND'} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="sellling-price-output" label="Sellling price/Gia ban" value={(buyinPrice * 1.15).toFixed(2) + ' VND'} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="storageTB-output" label="StorageTB/Ton kho TB" value={storageTB * 1 + ' ' + measurement} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
          <div><TextField className={classes.output} id="storageCD-output" label="StorageCD/Ton kho CD" value={storageCD * 1 + ' ' + measurement} variant="outlined" onChange={handleLookup(lookupValue)} /></div>
        </Container>

      </div>
    )
  } else {
    return (
      <div>
        <h3 className={classes.primary1}>Loading</h3>
      </div>
    )
  }

}

export default App;
