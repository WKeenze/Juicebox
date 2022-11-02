const { client, getAllUsers, createUser } = require('./index');



  async function dropTables() {
    try {
        console.log("Dropping Tables")
      await client.query(`
            DROP TABLE IF EXISTS users;
      `);
      console.log("Tables Dropped")
    } catch (error) {
        console.log("Error Dropping Tables")
      throw error; // we pass the error up to the function that calls dropTables
    }
  }
  
  // this function should call a query which creates all tables for our database 
  async function createTables() {
    try {
        console.log("Building Tables")
      await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL
            );
      `);
      console.log("Tables Built")
    } catch (error) {
        console.log("Error Building Tables")
      throw error; // we pass the error up to the function that calls createTables
    }
  }
  async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
        
      await createUser({ username: 'albert', password: 'bertie99' });
      await createUser({ username: 'sandra', password: '2sandy4me' });
      await createUser({ username: 'glamgal', password: 'soglam' });
  
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      console.error(error);
    } 
  }

  async function testDB() {
    try {
        console.log("Testing DB")
      
     const users = await getAllUsers();
      console.log("getAllUsers:", users);
      console.log("Test Finished")
    } catch (error) {
        console.error(error);
    } 
  }
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
  
