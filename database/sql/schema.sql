-- eatery management schema

-- Note:
-- type of start and end offer in the voucher table
-- range for ratings
-- use a code in the voucher

create table LoginInfo (
    id          integer auto_increment,
    login       text not null,
    password    text not null,
    primary key (id)
);

create table UserAccount (
    id          integer auto_increment,
    first       text not null,
    last        text not null,
    login       integer not null references LoginInfo(id),
    address     integer references Address(id),
    primary key (id)
);

create table EateryAccount (
    id          integer auto_increment,
    name        text not null,
    address     integer references Address(id),
    phone       integer not null,
    email       text,
    login       integer not null references LoginInfo(id),
    url         text,
    primary key (id) 
);

create table Address (
    id          integer auto_increment,
    street      text not null,
    suburb      text not null,
    region      char(3) not null, 
    postcode    integer(4) not null, 
    primary key (id)
);

create table RestaurantOwners (
    id          integer auto_increment,
    first       text not null,
    last        text not null,
    ownerOf     integer references EateryAccount(id),
    primary key (id)
);

create table SubscribedTo (
    userId          integer references UserAccount(id),
    restaurantId    integer references EateryAccount(id),
    primary key (userId, restaurantId) 
);

create table Reviews (
    id              integer auto_increment,
    userId          integer references UserAccount(id),
    restaurantId    integer references EateryAccount(id),
    -- may need to set range later on
    rating          integer, 
    comment         text,
    primary key (id)
);

create table Posts (
    id          integer auto_increment,
    postedBy    integer references RestaurantOwners(id),
    title       text,
    content     text,
    primary key (id)
);

create table Cuisines (
    id          integer auto_increment,
    name        text,
    primary key (id)
);

create table CuisineOffer (
    restaurantId    integer references EateryAccount(id),
    cuisineId       integer references Cuisines(id),
    primary key (restaurantId, cuisineId)
);

create table Voucher (
    id              integer auto_increment,
    offeredBy       integer references EateryAccount(id),
    discount        decimal(3,2), -- 25.25%, 32.50%, etc
    startOffer      datetime, -- 2022-04-22 10:34:23:55
    endOffer        datetime, 
    description     text,
    code            text, 
    primary key (id)
);

create table DietaryRestrictions (
    id              integer auto_increment,
    restriction     text not null,
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
    id              integer auto_increment,
    restaurantId    integer references EateryAccount(id),
    day             text,
    open            text,
    close           text,
    primary key (id)
);

