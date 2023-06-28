-- sql views related to eatery restaurant

-- refresh view table
drop view if exists restaurantInfo;
drop view if exists restaurantLoginInfo;
drop view if exists restaurantCuisines;
drop view if exists restaurantBusinessHour;
drop view if exists restaurantPosts;
drop view if exists restaurantVoucher;

-- restaurant general info
create view restaurantInfo as
select  ea.name, ea.phone, ea.email, ea.url, a.street, a.suburb, a.region, a.postcode
from    EateryAccount ea
join    Address a on (ea.address = a.id)
join    restaurantOwners ro on (ro.ownerOf = ea.id)
;

-- restaurant login info
create view restaurantLoginInfo as
select  ea.name, l.login, l.password
from    EateryAccount ea
join    LoginInfo l on (ea.login = l.id)
;

-- restaurant cusines that they offer
create view restaurantCuisines as
select  ea.name, c.name
from    EateryAccount ea
join    CuisineOffer co on (co.restaurantId = ea.id)
join    Cuisines c on (co.cuisineId = c.id)
;

-- restaurant business hour
create view restaurantBusinessHour as
select  ea.name, bh.day, bh.open, bh.close
from    EateryAccount ea 
join    BusinessHour bh on (ea.id = bh.restaurantId)
;

-- posts made by the restaurant
create view restaurantPosts as
select  ro.first, ro.last, ea.name, p.title, p.content
from    EateryAccount ea
join    Posts p on (ea.id = p.postedBy)
join    restaurantOwners ro on (ro.ownerOf = ea.id)
;

-- vouchers offered by restaurant
create view restaurantVoucher as
select  ea.name, v.discount, v.startOffer, v.endOffer, v.description, v.code
from    EateryAccount ea
join    Voucher v on (ea.id = v.offeredBy)
;
