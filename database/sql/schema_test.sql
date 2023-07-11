-- eatery management schema
-- for testing with the database, every value don't have no null constraint
-- compared to schema.sql

create table LoginInfo (
    id          integer,
    login       text,
    password    text,
    primary key (id)
);

create table UserAccount (
    id          integer,
    first       text,
    last        text,
    login       integer references LoginInfo(id),
    address     integer references Address(id),
    primary key (id)
);

create table EateryAccount (
    id          integer,
    name        text,
    address     integer references Address(id),
    phone       integer,
    email       text,
    login       integer references LoginInfo(id),
    url         text,
    hours       integer, 
    primary key (id) 
);

create table Address (
    id          integer,
    street      text,
    suburb      text,
    region      char(3), 
    postcode    integer(4), 
    primary key (id)
);

create table RestaurantOwners (
    id          integer,
    first       text,
    last        text,
    ownerOf     integer references EateryAccount(id),
    primary key (id)
);

create table SubscribedTo (
    userId          integer references UserAccount(id),
    restaurantId    integer references EateryAccount(id),
    primary key (userId, restaurantId) 
);

create table Reviews (
    id              integer,
    userId          integer references UserAccount(id),
    restaurantId    integer references EateryAccount(id),
    -- may need to set range later on
    rating          integer, 
    comment         text,
    primary key (id)
);

create table Posts (
    id          integer,
    postedBy    integer references RestaurantOwners(id),
    title       text,
    content     text,
    primary key (id)
);

create table Cuisines (
    id          integer,
    name        text,
    primary key (id)
);

create table CuisineOffer (
    restaurantId    integer references EateryAccount(id),
    cuisineId       integer references Cuisines(id),
    primary key (restaurantId, cuisineId)
);

create table Voucher (
    id              integer,
    offeredBy       integer references EateryAccount(id),
    discount        decimal(3,2), -- 25.25%, 32.50%, etc
    startOffer      datetime, -- 2022-04-22 10:34:23:55
    endOffer        datetime, 
    description     text,
    code            text, -- in consideration
    primary key (id)
);

create table DietaryRestrictions (
    id              integer,
    restriction     text,
    primary key (id)
);

create table userDietary (
    userId      integer references UserAccount(id),
    dietId      integer references DietaryRestrictions(id),
    primary key (userId, dietId)
);

create table provideDietary (
    restaurantId    integer references EateryAccount(id),
    dietId          integer references DietaryRestrictions(id),
    primary key (restaurantId, dietId)
);

create table BusinessHour (
    id      integer,
    day     text,
    open    text,
    close   text,
    primary key (id)
);