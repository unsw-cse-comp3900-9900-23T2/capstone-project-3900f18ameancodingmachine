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