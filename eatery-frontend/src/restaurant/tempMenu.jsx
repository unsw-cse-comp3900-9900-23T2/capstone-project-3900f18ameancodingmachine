import React from 'react';
import {Card, Typography, List, ListItem, ListItemText} from '@mui/material';

/**
 *
 * @return {*}
 */
export default function tempMenu() {
  return (
    <Card>
      <Typography variant="h5">Menu</Typography>
      <Typography variant="h6">Appetizers:</Typography>
      <List>
        <ListItem>
          <ListItemText primary="1. Garlic Bread" secondary="$6.99" />
        </ListItem>
        <ListItem>
          <ListItemText primary="2. Caesar Salad" secondary="$8.50" />
        </ListItem>
        <ListItem>
          <ListItemText primary="3. Calamari Fritti" secondary="$10.99" />
        </ListItem>
      </List>

      <Typography variant="h6">Main Courses:</Typography>
      <List>
        <ListItem>
          <ListItemText primary="4. Classic Burger" secondary="$12.50" />
        </ListItem>
        <ListItem>
          <ListItemText primary="5. Margherita Pizza" secondary="$14.99" />
        </ListItem>
        <ListItem>
          <ListItemText primary="6. Grilled Salmon" secondary="$18.95" />
        </ListItem>
        <ListItem>
          <ListItemText primary="7. Vegetable Stir-Fry" secondary="$13.50" />
        </ListItem>
      </List>

      <Typography variant="h6">Desserts:</Typography>
      <List>
        <ListItem>
          <ListItemText primary="8. Chocolate Lava Cake" secondary="$7.50" />
        </ListItem>
        <ListItem>
          <ListItemText primary="9. New York Cheesecake" secondary="$6.99" />
        </ListItem>
      </List>

      <Typography variant="h6">Beverages:</Typography>
      <List>
        <ListItem>
          <ListItemText primary="10. Soft Drinks" secondary="$2.50" />
        </ListItem>
        <ListItem>
          <ListItemText primary="11. Iced Tea" secondary="$3.00" />
        </ListItem>
        <ListItem>
          <ListItemText primary="12. Coffee" secondary="$2.99" />
        </ListItem>
      </List>
    </Card>);
}
