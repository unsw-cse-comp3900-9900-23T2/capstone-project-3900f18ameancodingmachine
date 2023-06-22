-- test inserting user
insert into LoginInfo (id, login, password)
values (1, 'newuser', 'password');

insert into UserAccount (id, first, last, login, address)
values (1, 'user', 'name', 1, null);