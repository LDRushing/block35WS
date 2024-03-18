//use Block 36 WS as a guide 
const pg = require('pg'); 
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_stores_db')
const uuid = require('uuid'); 
const bcrypt = require('bcrypt'); 

const createTables = async() => {
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
        id UUID PRIMARY KEY, 
        username VARCHAR(100) UNIQUE NOT NULL, 
        password VARCHAR(255)
    );
    CREATE TABLE skills(
        id UUID PRIMARY KEY, 
        name VARCHAR(100) UNIQUE NOT NULL
    ); 
    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        favorites UUID REFERECNES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_product_user UNIQUE (products_id, user_id
        );    
    `;
    await client.query(SQL); 
}; 

const createProduct = async ({ name })=> {
    const SQL = `
    INSERT INTO products(id, name) VALUES ($1, $2) RETURNING * 
  `;
  const response = await client.query(SQL, [ uuid.v4(), name]);
  return response.rows[0];
};

const createUser = async({ username, password })=> { // - creates a user given a username and password (we can use bcrypt to hash)
    const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `; 
    const response = await client.query(SQL, [ uuid.v4(), username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  }; //- creates a user and is given a name

const fetchUsers = async()=> {
    const SQL = `
    SELECT id, username
    FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};
   
const fetchProducts = async()=> { //fetches all the products
    const SQL = `
    SELECT *
    FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createFavorite = async({ user_id, product_id})=> {
    const SQL = `
    INSERT INTO favorites(id, user_id, product_id) VALUES ($1, $2, $3) RETURNING * 
  `;
  const response = await client.query(SQL, [ uuid.v4(), user_id, product_id]);
  return response.rows[0];
};
// - adds a user_skill
const destroyFavorite = async(user_id)=> {
    const SQL = `
    DELETE *
    FROM favorites
    WHERE user_id = $1 AND id= $2
  `;
  const response = await client.query(SQL, [ user_id, id ]);
  return response.rows;
};//- removes a favorite

const fetchFavorites = async(user_id)=> {
    const SQL = `
    SELECT *
    FROM favorites
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [ user_id ]);
  return response.rows;
};//- takes an id for a user and returns their user_skills


module.exports = {
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    destroyFavorite,
    fetchFavorites,
    createFavorite, 
}
