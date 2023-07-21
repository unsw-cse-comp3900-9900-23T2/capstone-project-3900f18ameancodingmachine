import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function Browse(){
    //Grab the variables from url for use later
    //:location&:cuisine&:dietary
    /*
    const location = new URLSearchParams(useLocation().search).get('location');
    const cuisine = new URLSearchParams(useLocation().search).get('cuisine');
    const dietary = new URLSearchParams(useLocation().search).get('dietary');
    */
    const {location} = useParams();
    const {cuisine} = useParams();
    const {dietary} = useParams();
    

    return(
        <Container maxWidth="600">
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
                        User Home
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={() => alert(cuisine)} sx={{minHeight: 295, bgcolor:"black"}}>Test</Button>
                </CardActions>
            </Card>
        </Container>
    );
}