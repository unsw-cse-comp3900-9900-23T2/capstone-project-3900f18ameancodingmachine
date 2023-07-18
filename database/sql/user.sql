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
    ea.name, 
    a.street, 
    a.suburb, 
    a.region, 
    a.postcode,
    ea.phone,
    ea.email,
    ea.url 
from    SubscribedTo st
join    EateryAccount ea on (ea.id = st.restaurantId)
join    Address a on (a.id = ea.address)
;

-- see user reviews
create view userReviews as
select  u.first, u.last, ea.name, r.rating, r.comment
from    UserAccount u
join    Reviews r on (r.userId = u.id)
join    EateryAccount ea on (ea.id = r.restaurantId)
;


