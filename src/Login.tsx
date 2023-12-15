import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} sx={{ margin: 5 }}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.turksat.com.tr/tr/bilisim/proje-yonetimi">
      Türksat Uydu Haberleşme Kablo TV ve İşletme A.Ş.
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {

  // state showing error message:
  const [errorMessage, setErrorMessage] = useState<string>("");

  let navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestBody = {
      username: data.get('email'),
      password: data.get('password'),
    };
    //console.log(requestBody);

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        console.log('Authentication failed: Invalid credentials');
        setErrorMessage("Lütfen kullanıcı adı ve şifrenizi kontrol ediniz.");
      } else if (!response.ok) {
        console.log(`Error! status: ${response.status}`);
        setErrorMessage("Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyiniz.");
      }
      else {
        setErrorMessage("");
        const responseData = await response.text();
        // Save the token to sessionStorage
        sessionStorage.setItem('token', responseData);
        sessionStorage.setItem('username', requestBody.username?.toString()!);

       
          try {
            const token = sessionStorage.getItem('token');
            const username = sessionStorage.getItem('username');

            const response = await fetch('http://localhost:8080/role/' + username, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`, // Add the Bearer token to the Authorization header
              },
            });
            if (response.status === 401) {
              console.log('Authentication failed: Invalid credentials');
            } else if (!response.ok) {
              console.log(`Error! status: ${response.status}`);
            } else {
              const responseData = await response.text();
              console.log("fetch: ", responseData);
              sessionStorage.setItem('role', responseData);
            }
          } catch (e) {
            console.log('Error', e);
          }
          if ( sessionStorage.getItem('role') === "ROLE_ADMIN")
            navigate('/admin/users');
          else
            navigate('/user/add-off-days');
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1392c2',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#c25994' }}>
            <LoginIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Oturum Aç
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Kullanıcı Adı"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button className="button" style={{ verticalAlign: 'middle' }}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Oturum Aç
            </Button>
            <Button
              className="button"
              style={{ verticalAlign: 'middle' }}
              type="button"  //  bu bir form gönderme butonu değil, sadece bir navigasyon butonu
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => navigate('/register-user')}  
            >
              Kayıt Ol
            </Button>

          </Box>
          {errorMessage !== "" && <Alert sx={{ margin: 4 }} severity="error"><AlertTitle>Giriş Hatası</AlertTitle>{errorMessage}</Alert>}
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}