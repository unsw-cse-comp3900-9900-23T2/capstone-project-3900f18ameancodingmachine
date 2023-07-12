import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import * as React from 'react';
import axios from 'axios';
import validator from 'validator';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

/*
 *  This function should send the password reset along with the verification code to
 *  reset the users password
 */
async function resetPass(login, password) {
    try {
        //ERROR HERE!!!!
        const {data} = await axios.post("api/user/resetpassword", {login: login, password: password});
        if (data.success) {
            console.log("Password has been reset");
            return true;
        }
    } catch {
        console.log("Password reset has failed");    
    } 
    return false;
} 

function ForgotPassNewPass(){
    const [newPass, setNewPass] = React.useState('');
    const [checkNewPass, setCheckNewPass] = React.useState('');
    const [isPassMatch, setIsPassMatch] = React.useState(true);
    const [isPassStrong, setIsPassStrong] = React.useState(true);
    const { state } = useLocation();
    const navigate = useNavigate();

    /* 
     *  checkPassMatch compares the two given passwords.
     *  It sets isPassMatch and returns the same value
     */
    function checkPassMatch(newPass, checkNewPass){
        if (newPass == checkNewPass) {
            setIsPassMatch(true);
            return true
        }
        setIsPassMatch(false);
        return false
    }

    /*
     * handleSubmit is called when the button is pressed
     * It prevents default behaviour, checks if the passwords match
     * If so it uses resetPass() to reset the given users password
     * and navigates to the main screen.
     * Otherwise it does nothing
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (checkPassMatch(newPass, checkNewPass)){
            if (validator.isStrongPassword(newPass)) {
                await resetPass(state.login, newPass);
                navigate("/");    
            } else {
                setIsPassStrong(false);
            }
        }
    }
    
    return (
        <Container maxWidth="md">
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                    Code Entry
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Enter New Password
                </Typography>
                <TextField required id="set-newPass" label="Password" value={newPass} onChange={(event) => {
                    setNewPass(event.target.value);
                    }}
                />
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Re-Enter New Password
                </Typography>
                <TextField required id="set-checkNewPass" label="Re-Enter Password" value={checkNewPass} onChange={(event) => {
                    setCheckNewPass(event.target.value);
                    }}
                />
                {!isPassMatch && <Typography sx={{ fontSize: 14 }} color="red" gutterBottom>Passwords Do Not Match</Typography> }
                {!isPassStrong && <Typography sx={{ fontSize: 14 }} color="red" gutterBottom>Password length must be atleast 8 with 1 uppercase and lowercase character aswell as 1 number and symbol</Typography> }
                </CardContent>
                <CardActions>
                <Button size="small" onClick={handleSubmit}>Submit Code</Button>
                </CardActions>

            </Card>
    </Container>
    )
}

export default ForgotPassNewPass;