-- eatery management schema

-- Note:
-- for start and end offer in voucher table, need to discuss the type that is needed
-- discuss ratings, specifically for the range
-- discuss about whether we use a code in the voucher

create table LoginInfo {
    id          integer,
    login       text not null,
    password    text not null,
    primary key (id)
};

create table UserAccount {
    id          integer,
    first       text not null,
    last        text not null,
    login       integer not null references LoginInfo(id),
    address     integer references Address(id),-- foreign key for address table
    primary key (id)
};

create table EateryAccount {
    id          integer,
    name        text not null,
    address     integer,-- foreign key for address table
    phone       integer not null,
    email       text,
    login       integer not null references LoginInfo(id),
    url         text,
    hours       integer, --foreign key for BusinessHour table
    primary key (id) 
};

create table Address {
    id          integer,
    street      text not null,
    suburb      text not null,
    region      char(3) not null, -- NSW, QLD, VIC, etc
    postcode    integer(4) not null, --2020, 1920, etc
    primary key (id)
};

create table RestaurantOwners {
    id          integer,
    first       text not null,
    last        text not null,
    ownerOf     id references EateryAccount(id),
    primary key (id)
};

create table SubscribedTo {
    userId          integer references UserAccount(id),
    restaurantId    integer references EateryAccount(id),
    primary key (userId, restaurantId) 
};

create table Reviews {
    id              integer,
    userId          integer references UserAccount(id),
    restaurantId    integer references EateryAccount(id),
    rating          integer, --may need to set range
    comment         text,
    primary key (id)
};

create table Posts {
    id          integer,
    postedBy    integer references RestaurantOwners(id)
    title       text
    content     text,
    primary key (id)
};

create table Cuisines {
    id          integer,
    name        text
};

create table CuisineOffer {
    restaurantId    integer references EateryAccount(id),
    cuisineId       integer references Cuisines(id),
    primary key (restaurantId, cuisineId)
};

create table Voucher {
    id              integer,
    offeredBy       integer references EateryAccount(id),
    discount        decimal(3,2), -- 25.25%, 32.50%, etc
    startOffer      datetime, -- 2022-04-22 10:34:23:55
    endOffer        datetime, 
    description     text,
    code            text, -- may not needed
    primary key (id)
};

