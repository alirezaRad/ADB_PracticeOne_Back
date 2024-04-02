const express = require('express');
const { connectToDatabase } = require('./db');
const DomainsRouter = require('./routes/domains');
const createDomainModel = require('./domainIpModel');
const cors = require('cors');


//Logic

const {app, PORT} = FirstSetup();

connectToDatabase()
    .then(() => {
        MakingRouters();
        StartServer();
    })
    .catch(err => {
        console.error('Error starting server:', err);
        process.exit(1);
    });


///Functions
function FirstSetup() {
    const app = express();
    const PORT = process.env.PORT || 3002;
    app.use(express.json());
    app.use(cors());
    return {app, PORT};
}

function MakingRouters() {
    const domainModel = createDomainModel();
    const domainsRouter = DomainsRouter(domainModel);
    app.use('/api', domainsRouter);
}

function StartServer() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}