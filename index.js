const {app, httpServer} = require("./app");

const PORT = process.env.PORT || 5500;


httpServer.listen(PORT, () => console.log('Server has been started on localhost:' + PORT))