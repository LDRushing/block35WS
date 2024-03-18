//Express statement at the top. 
//Require functions from data layer (module exports)
// GET /api/users - returns array of users
// GET /api/products - returns an array of products
// GET /api/users/:id/favorites - returns an array of favorites for a user
// POST /api/users/:id/favorites - payload: a product_id
// returns the created favorite with a status code of 201
// DELETE /api/users/:userId/favorites/:id - deletes a favorite for a user, returns nothing with a status code of 204
const {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorite
} = require('./db')
const express = require('express'); 
const app = express();
app.use(express.json()); 

// GET /api/prpducts - returns array of products
app.get('/api/products', async(req, res, next) => { 
 try {
    res.send(await fetchProducts()); 
 }
 catch(ex){
    next(ex); 
 }
 }); 

 app.get('/api/users', async(req, res, next)=> { //GET users returns an array of users. 
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});


// GET /api/users/:id/favorites - returns an array of favorites for a user
app.get('/api/users/:id/favorites', async(req, res, next)=> {
  try {
    res.send(await fetchFavorites(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

//DELETE /api/users/:userID/favorites/:id - deletes a favorite for a user, returns a STATUS 204. 
app.delete('/api/uses/:userId/favorites/:id', async(req, res, next)=> {
try {
  await destroyFavorite({ user_id: req.params.userId, id: req.params.id });
  res.sendStatus(204);
}
catch(ex){
  next(ex);
}
});

    // POST /api/users/:id/favorites - payload: a product_id
app.post("/api/users/:id/favorites", isLoggedIn, async (req, res, next) => {
    try {
      if (req.params.id !== req.user.id) {
        const error = Error("not authorized");
        error.status = 401;
        throw error;
      }
      res
        .status(201)
        .send(
          await createProduct({
            user_id: req.params.id,
            product_id: req.body.skill_id,
          })
        );
    } catch (ex) {
      next(ex);
    }
  });

  const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [spike, lucy, yasha, heff, laptop, smartPhone, earphones, charger] = await Promise.all([
      createUser({ username: 'spike', password: 'leaves' }),
      createUser({ username: 'lucy', password: 'pilgrim' }),
      createUser({ username: 'yasha', password: 'shhh' }),
      createUser({ username: 'heff', password: 'mouse'}),
      createProduct({ name: 'laptop'}),
      createProduct({ name: 'smartPhone'}),
      createProduct({ name: 'earphones'}),
      createProduct({ name: 'charger'}),
    ]);
    const users = await fetchUsers();
    console.log(users);
  }
  
    const products = await fetchProducts();
    console.log(products);
  
    const favorites = await Promise.all([
      createFavorite({ user_id: spike.id, product_id: laptop.id}),
      createFavorite({ user_id: lucy.id, product_id: smartPhone.id}),
      createFavorite({ user_id: yasha.id, product_id: earphones.id}),
      createFavorite({ user_id: heff.id, product_id: charger.id}),
    ]);  
//Seed the DB and complete the implementation of my data layer. 

init();