CREATE TABLE IF NOT EXISTS todos (
    id serial primary key,
    title text,
    status varchar(20) default "not-done"
);