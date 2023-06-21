create table LoginInfo {
    id          integer,
    login       text not null,
    password    text not null,
    primary key (id)
}

create table UserAccount {
    id          integer,
    first       text not null,
    last        text not null,
    login       integer not null references LoginInfo(id),
    address     ,-- foreign key for address table
    primary key (id)
}

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
}