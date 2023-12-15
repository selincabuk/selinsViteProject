import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import dayjs, { Dayjs } from 'dayjs';
import Alert from '@mui/material/Alert';
import HowToRegIcon from '@mui/icons-material/HowToReg';


export default function SignUp() {

  // state to get date from datepicker:
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
    dayjs('1999-05-01')
  );

  // state to show error:
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState<string>("");

  // state to show success:
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // öncelikle boş field var mı diye bak, varsa hiç girişme bile
    const username = data.get('username')?.toString();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    const firstname = data.get('firstName')?.toString();
    const lastname = data.get('lastName')?.toString();
    const gender = data.get('gender')?.toString();
    const birthday = selectedDate;

    if (!username || !email || !password || !firstname || !lastname || !gender || !birthday ||
      username.trim() === '' || email.trim() === '' || password.trim() === '' ||
      firstname.trim() === '' || lastname.trim() === '' || gender.trim() === '') {
      setError(true);
      setErrorText("Lütfen tüm alanları doldurunuz!");
      return;
    }

    const requestBody = {
      username: username,
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      birthday: birthday,
    };

    console.log("Request body: ", requestBody);
    const token = sessionStorage.getItem('token');
    // register user:
    fetch('http://localhost:8080/new-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`, // Add the Bearer token to the Authorization header
      },
      body: JSON.stringify(requestBody),
    })

      .then((response) => {
        if (response) {
          console.log('Registration successful');
          setSuccess(true);
          setError(false);
          setTimeout(() => {
            window.location.reload();
          }, 2000); // 2000 milliseconds = 2 seconds
        } else {
          console.log('Registration failed');
          setError(true);
          setSuccess(false);
          setErrorText("Kayıt başarısız!");
        }
      }
      )
      .catch((error) => {
        console.log(error);
      }
      );
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#3eb2cf',
      },
    },    
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: "10vh",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#c25994' }}>
            <HowToRegIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Kullanıcı Kaydı
          </Typography>
          {error && (
            <Alert severity='error' sx={{ mt: 1, mb: 2 }}>
              {errorText}
            </Alert>)}
          {success && (
            <Alert severity='success' sx={{ mt: 1, mb: 2 }}>
              Kayıt başarılı!
            </Alert>)}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3, paddingLeft: "0px" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Ad"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Soyad"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Kullanıcı Adı"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Şifre"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel sx={{ justifyContent: 'center', pl: 21 }} component="legend">Cinsiyet</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      row
                      sx={{ justifyContent: 'center', pl: 14 }}
                    >
                      <FormControlLabel value="Kadın" control={<Radio />} label="Kadın" />
                      <FormControlLabel value="Erkek" control={<Radio />} label="Erkek" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={-2}>
              {/* <DatePickerValue handleDateChange={handleDateChange} /> */}
            </Grid>
            
            <Button
              className="button"
              style={{ verticalAlign: 'middle', color: 'white'}}
              type="submit"
              fullWidth
              variant="contained"
              
              sx={{ mt: 3, mb: 2}}
            >
              KAYIT OL
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}