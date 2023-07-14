drop table if exists provideDietary;
drop table if exists SubscribedTo;
drop table if exists userDietary;

create table provideDietary (
    restaurantId    integer,
    dietId          integer,
    primary key (restaurantId, dietId),
    FOREIGN KEY (restaurantId) REFERENCES EateryAccount(id),
    FOREIGN KEY (dietId) REFERENCES DietaryRestrictions(id)
);

create table SubscribedTo (
    userId          integer,
    restaurantId    integer references EateryAccount(id),
    primary key (userId, restaurantId),
    FOREIGN KEY (userId) REFERENCES UserAccount(id),
    FOREIGN KEY (restaurantId) REFERENCES EateryAccount(id)
);

create table userDietary (
    userId      integer,
    dietId      integer,
    primary key (userId, dietId),
    FOREIGN KEY (userId) REFERENCES UserAccount(id),
    FOREIGN KEY (dietId) REFERENCES DietaryRestrictions(id)
);
