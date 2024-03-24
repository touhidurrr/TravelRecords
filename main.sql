-- schema for users
create table users (
    id integer primary key autoincrement,
    name text not null,
    username text not null unique,
    password text not null
);

-- schema for bank accounts
create table accounts (
    id integer primary key autoincrement,
    name text not null,
    balance real default 0,
    userId integer not null references users(id),
    unique(name, userId)
);

-- schema for records
create table records (
    id integer primary key autoincrement,
    name text not null,
    description text,
    createdBy integer not null references users(id),
    createdAt text default (datetime('now'))
);

-- schema for record users
create table recordusers (
    recordId integer not null references records(id),
    userId integer not null references users(id),
    primary key (recordId, userId)
);

-- schema for products
create table products (
    id integer primary key autoincrement,
    name text,
    price real,
    addedBy integer references users(id),
    createdAt text default (datetime('now'))
);

-- schema for product spendings
create table spendings (
    id integer primary key autoincrement,
    name text,
    amount real,
    productId integer references products(id),
    paidWith integer references accounts(id)
);

-- schema for consumers
create table consumedby (
    productId integer references products(id),
    userId integer references users(id),
    primary key (productId, userId)
);
