create table RestaurantMenu (
    id              integer auto_increment,
    restaurantId    integer REFERENCES EateryAccount(id),
    category        text,
    name            text,
    price           decimal(10,2),
    description     text,
    primary key (id)
);