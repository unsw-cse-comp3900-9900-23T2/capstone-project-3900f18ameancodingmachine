import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as React from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

/*
 *  Checks credentials with backend, if successful set the recieved sessionID and returns true
 *  Otherwise return false
 */
async function checkCredentials(email, pass) {
  try {
    const { data } = await axios.post("api/user/login", {
      login: email,
      password: pass,
    });
    if (data.success) {
      console.log("Login success!");
      return true;
    }
  } catch {
    console.log("Failed login request");
  }
  return false;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [logInFail, setLogInFail] = useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
     *  Send email and password to backend to check if they are valid
     *  If so, proceed to homepage as a logged in user
     *  Else print underneath "Incorrect Email or Password"
     */
    if (await checkCredentials(email, password)) {
      console.log("success");
      navigate("/home");
    }
    setLogInFail(true);
  };

  const passRecovery = () => {
    navigate("/Recovery");
  };

  return (
    <Container maxWidth="md" sx={{ bgcolor: "white" }}>
      <Card
        sx={{
          maxWidth: 500,
          m: 10,
          border: "10px inset #61dafb",
          bgcolor: "#F5F5F5",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
            Log In
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Email Address
          </Typography>
          <TextField
            sx={{ bgcolor: "white" }}
            fullWidth
            required
            id="register-email"
            label="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Password
          </Typography>
          <TextField
            sx={{ bgcolor: "white" }}
            fullWidth
            required
            type="password"
            id="register-password"
            label="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          {logInFail && (
            <Typography sx={{ fontSize: 14 }} color="red" gutterBottom>
              Incorrect Email or Password
            </Typography>
          )}
        </CardContent>

        <CardActions>
          <Button
            size="small"
            sx={{ maxWidth: 150, bgcolor: "white", borderRadius: "4px" }}
            onClick={handleSubmit}
          >
            Log In
          </Button>
        </CardActions>

        <CardActions>
          <Button
            size="small"
            sx={{ maxWidth: 200, bgcolor: "white", borderRadius: "4px" }}
            onClick={passRecovery}
          >
            Forgot Password?
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
