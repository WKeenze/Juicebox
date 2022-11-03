const { client, getAllUsers, createUser, updateUser, createPost, updatePost, getAllPosts, getPostsByUser, getUserById } = require('./index');



  async function dropTables() {
    try {
        console.log("Dropping Tables")
      await client.query(`
        DROP TABLE IF EXISTS posts;      
        DROP TABLE IF EXISTS users;
            
      `);
      console.log("Tables Dropped")
    } catch (error) {
        console.log("Error Dropping Tables")
      throw error;
    }
  }
  

  async function createTables() {
    try {
        console.log("Building Tables")
      await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );

            CREATE TABLE posts(
              id SERIAL PRIMARY KEY,
              "authorId" INTEGER REFERENCES users(id) NOT NULL,
              title VARCHAR(255) NOT NULL,
              content TEXT NOT NULL,
              active BOOLEAN DEFAULT true
            );
      `);
      console.log("Tables Built")
    } catch (error) {
        console.log("Error Building Tables")
      throw error; 
    }
  }


  async function createInitialUsers() {
    try {
      console.log("Creating Users");
        
      await createUser({ 
        username: 'albert', 
        password: 'bertie99', 
        name: 'Al Bert', 
        location: 'Sidney, Australia' });
      
      await createUser({ 
        username: 'sandra', 
        password: '2sandy4me', 
        name: 'Just Sandra', 
        location: "Ain't tellin"});

      await createUser({ 
        username: 'glamgal', 
        password: 'soglam', 
        name: 'Joshua', 
        location: 'Upper East Side' });
  
      console.log("Finished creating users!");

    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }

  async function createInitialPost() {
    try {
      const [albert, sandra, glamgal] = await getAllUsers();
  
      console.log("Starting to create posts...");
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "FIRST!!!!!!"
      });
  
      await createPost({
        authorId: sandra.id,
        title: "Testing",
        content: "This is not a test."
      });
  
      await createPost({
        authorId: glamgal.id,
        title: "Invasion",
        content: "Invading all your posts."
      });
      console.log("Tables Created!");

    } catch (error) {
      console.log("Error creating posts!");
      throw error;
    }
  }
  
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPost();
      await updatePost()

    } catch (error) {
      console.error(error);
    } 
  }

  async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers")
      const users = await getAllUsers();
      console.log("Result:", users);

      
      console.log("Calling updateUser on users[0]")
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });

      console.log("Result:", updateUserResult);

      console.log("Calling getAllPosts")
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");

    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
   


  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
  
