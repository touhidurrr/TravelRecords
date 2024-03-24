-- schema for users
create table users (
    id int primary key,
    name text,
    username text,
    email text,
    password text
);

-- schema for bank accounts
create table bankaccounts (
    id int primary key,
    name text,
    balance real default 0,
    userId int references users(id)
);

-- schema for records
create table records (
    id int primary key,
    name text,
    description text,
    createdBy int references users(id),
    createdAt text default (datetime('now'))
);

-- schema for products
create table products (
    id int primary key,
    name text,
    price real,
    addedBy int references users(id),
    createdAt text default (datetime('now'))
);

-- schema for product spendings
create table spendings (
    id int primary key,
    name text,
    amount real,
    productId int references products(id),
    paidWith int references bankaccounts(id)
);

-- schema for consumers
create table consumedby (
    productId int references products(id),
    userId int references users(id),
    primary key (productId, userId)
);
