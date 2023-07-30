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
select  ea.name as "eatery", c.name "cuisine"
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
select  ro.first, ro.last, ea.name, p.title, p.content
from    EateryAccount ea
join    Posts p on (ea.id = p.postedBy)
join    RestaurantOwners ro on (ro.ownerOf = ea.id)
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