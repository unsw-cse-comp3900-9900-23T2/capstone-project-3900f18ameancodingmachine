-- eatery management schema

-- tables
create table LoginInfo (
    id          integer auto_increment,
    login       text not null,
    password    text not null,
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

create table UserAccount (
    id          integer auto_increment,
    first       text not null,
    last        text not null,
    login       integer not null,
    address     integer,
    primary key (id),
    foreign key (login) references LoginInfo(id) on delete cascade,
    foreign key (address) references Address(id) on delete cascade 
);

create table EateryAccount (
    id              integer auto_increment,
    name            text not null,
    address         integer,
    phone           integer not null,
    email           text,
    login           integer,
    url             text,
    description     text,
    primary key (id),
    foreign key (address) references Address(id) on delete cascade ,
    foreign key (login) references LoginInfo(id) on delete cascade 
);

create table RestaurantOwners (
    id          integer auto_increment,
    first       text not null,
    last        text not null,
    ownerOf     integer,
    primary key (id),
    foreign key (ownerOf) references EateryAccount(id) on delete cascade 
);

create table SubscribedTo (
    userId          integer,
    restaurantId    integer,
    primary key (userId, restaurantId),
    FOREIGN KEY (userId) REFERENCES UserAccount(id) on delete cascade ,
    FOREIGN KEY (restaurantId) REFERENCES EateryAccount(id) on delete cascade 
);

create table Reviews (
    id              integer auto_increment,
    userId          integer references UserAccount(id),
    restaurantId    integer references EateryAccount(id),
    rating          integer, 
    comment         text,
    primary key (id),
    foreign key (userId) references UserAccount(id) on delete cascade ,
    foreign key (restaurantId) references EateryAccount(id) on delete cascade 
);

create table Posts (
    id          integer auto_increment,
    postedBy    integer,
    title       text,
    content     text,
    likes       integer default 0,
    primary key (id),
    foreign key (postedBy) references EateryAccount(id) on delete cascade 
);

create table Cuisines (
    id          integer auto_increment,
    name        text,
    primary key (id)
);

create table CuisineOffer (
    restaurantId    integer references EateryAccount(id),
    cuisineId       integer references Cuisines(id),
    primary key (restaurantId, cuisineId),
    foreign key (restaurantId) references EateryAccount(id) on delete cascade,
    foreign key (cuisineId) references Cuisines(id) on delete cascade 
);

create table Voucher (
    id              integer auto_increment,
    offeredBy       integer references EateryAccount(id),
    discount        decimal(5,2), -- 25.25%, 32.50%, etc
    startOffer      datetime, -- 2022-04-22 10:34:23:55
    endOffer        datetime, 
    count           integer,
    code            text, 
    primary key (id),
    foreign key (offeredBy) references EateryAccount(id) on delete cascade 
);

create table DietaryRestrictions (
    id              integer auto_increment,
    restriction     text not null,
    primary key (id)
);

create table userDietary (
    userId      integer,
    dietId      integer,
    primary key (userId, dietId),
    FOREIGN KEY (userId) REFERENCES UserAccount(id) on delete cascade,
    FOREIGN KEY (dietId) REFERENCES DietaryRestrictions(id) on delete cascade 
);

create table provideDietary (
    restaurantId    integer,
    dietId          integer,
    primary key (restaurantId, dietId),
    FOREIGN KEY (restaurantId) REFERENCES EateryAccount(id) on delete cascade,
    FOREIGN KEY (dietId) REFERENCES DietaryRestrictions(id) on delete cascade 
);

create table BusinessHour (
    id              integer auto_increment,
    restaurantId    integer references EateryAccount(id),
    day             text,
    open            text,
    close           text,
    primary key (id),
    foreign key (restaurantId) references EateryAccount(id) on delete cascade 
);

create table userProfileImages (
    id          integer auto_increment,
    userId      integer references UserAccount(id),
    imagePath   text,
    primary key (id),
    foreign key (userId) references UserAccount(id) on delete cascade 
);

create table restaurantProfileImages (
    id              integer auto_increment,
    restaurantId    integer,
    imagePath       text,
    primary key (id),
    foreign key (restaurantId) references EateryAccount(id) on delete cascade 
);

create table PostComments (
    id          integer auto_increment,
    userId      integer,
    postId      integer,
    comment     text,
    primary key (id),
    FOREIGN KEY (userId) REFERENCES UserAccount(id) on delete cascade ,
    FOREIGN KEY (postId) REFERENCES Posts(id) on delete cascade  
);

create table Bookings (
    id              integer auto_increment,
    userId          integer,
    restaurantId    integer,
    voucherId       integer,
    active          boolean default 1,
    primary key (id),
    FOREIGN KEY (userId) REFERENCES UserAccount(id) on delete cascade,
    FOREIGN KEY (restaurantId) REFERENCES EateryAccount(id) on delete cascade,
    FOREIGN KEY (VoucherId) REFERENCES Voucher(id) on delete set null 
);

-- view tables

-- view related to user account

-- refresh view table
drop view if exists userInfo;
drop view if exists userLoginInfo;
drop view if exists userSubscription;
drop view if exists userReviews;

-- general user Info
create view userInfo as
select  u.first, u.last, a.street, a.suburb, a.region, a.postcode
from    UserAccount u
join    Address a on (a.id = u.address)
;

-- user login info
create view userLoginInfo as
select  u.first, u.last, l.login, l.password
from    UserAccount u 
join    LoginInfo l on (u.login = l.id)
;

-- see what the user subscribed to
create view userSubscription as
select
    st.userId,
    ea.id as restaurantId,
    ea.name, 
    a.street, 
    a.suburb, 
    a.region, 
    a.postcode,
    ea.phone,
    ea.email,
    ea.url,
    up.imagePath as image 
from        SubscribedTo st
left join   EateryAccount ea on (ea.id = st.restaurantId)
left join   Address a on (a.id = ea.address)
left join   restaurantProfileImages up on (up.restaurantId = ea.id)
;

-- see user reviews
create view userReviews as
select  u.first, u.last, ea.name, r.rating, r.comment
from    UserAccount u
join    Reviews r on (r.userId = u.id)
join    EateryAccount ea on (ea.id = r.restaurantId)
;

-- sql views related to eatery restaurant

-- refresh view table
drop view if exists restaurantInfo;
drop view if exists restaurantLoginInfo;
drop view if exists restaurantCuisines;
drop view if exists restaurantBusinessHour;
drop view if exists restaurantPosts;
drop view if exists restaurantVoucher;

-- restaurant general info
-- left join because cuisines not added yet to the restaurant
create view restaurantInfo as
select
    ea.id,
    ea.name, 
    ea.phone, 
    ea.email, 
    ea.url, 
    a.street, 
    a.suburb, 
    a.region, 
    a.postcode,
    c.name as cuisine,
    dr.restriction as diet,
    rp.imagePath as image
from         EateryAccount ea
left join    Address a on (ea.address = a.id)
left join    CuisineOffer co on (co.restaurantId = ea.id)
left join    Cuisines c on (co.cuisineId = c.id)
left join    provideDietary pd on (pd.restaurantId = ea.id)
left join    DietaryRestrictions dr on (dr.id = pd.dietId)
left join    restaurantProfileImages rp on (rp.restaurantId = ea.id)
;

-- restaurant login info
create view restaurantLoginInfo as
select  ea.name, l.login, l.password
from    EateryAccount ea
join    LoginInfo l on (ea.login = l.id)
;

-- restaurant cusines that they offer
create view restaurantCuisines as
select  ea.name as "eatery", c.name as "cuisine"
from    EateryAccount ea
join    CuisineOffer co on (co.restaurantId = ea.id)
join    Cuisines c on (co.cuisineId = c.id)
;

-- restaurant business hour
create view restaurantBusinessHour as
select  ea.id, ea.name, bh.day, bh.open, bh.close
from    EateryAccount ea 
join    BusinessHour bh on (ea.id = bh.restaurantId)
;

-- posts made by the restaurant
create view restaurantPosts as
select  
    p.id as postId, 
    ea.id as restaurantId, 
    ea.name, 
    p.title, 
    p.content
from    EateryAccount ea
join    Posts p on (ea.id = p.postedBy)
;

-- vouchers offered by restaurant
create view restaurantVoucher as
select  ea.name, v.discount, v.startOffer, v.endOffer, v.count, v.code
from    EateryAccount ea
join    Voucher v on (ea.id = v.offeredBy)
;

-- views table related to dietary

-- refresh view table
drop view if exists userDietaries;
drop view if exists restaurantProvideDietaries;

create view userDietaries as
select  u.first, u.last, dr.restriction
from    UserAccount u
join    userDietary ud on (u.id = ud.userId)
join    DietaryRestrictions dr on (dr.id = ud.dietId)
;

create view restaurantProvideDietaries as
select  ea.name, dr.restriction
from    EateryAccount ea
join    provideDietary pd on (ea.id = pd.restaurantId)
join    DietaryRestrictions dr on (dr.id = pd.dietId)
;

-- views table related to posts and comments

drop view if exists commentsFromUser;

create view commentsFromUser as
select
    pc.postId,
    ua.first,
    ua.last,
    pc.comment
from        UserAccount ua
left join   PostComments pc on (pc.userId = ua.id)
;

-- views table related to bookings
drop view if exists userBookings;

create view userBookings as
select
    ua.first,
    ua.last,
    b.userId,
    b.voucherId,
    b.active,
    v.offeredBy as restaurantId,
    v.code,
    v.discount
from UserAccount ua
join Bookings b on (ua.id = b.userId)
join Voucher v on (v.id = b.voucherId)
;