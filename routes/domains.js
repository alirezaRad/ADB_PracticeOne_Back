// routes/domains.js
const express = require('express');
const router = express.Router();
const {getDb} = require("../db");


function domainsRouter(domainModel) {
    
    router.get('/domains', async (req, res) => {
        await GetDomains(domainModel, res);
    });
    router.get('/master-ips', async (req, res) => {
        await GetMasterIpsAverage(domainModel, res);
    });
    router.get('/master-ips-count', async (req, res) => {
        await GetMasterIpsCount(domainModel, res);
    });
    router.get('/locations-avrage', async (req, res) => {
        await GetLocationAvrage(domainModel, res);
    });
    router.get('/owner-avrage', async (req, res) => {
        await GetOwnerAvrage(domainModel, res);
    });
    router.get('/expiring-domains', async (req, res) => {
        await GetExpireingDomains(domainModel, res);
    });
    router.get('/recent-domains', async (req, res) => {
        await GetRecentDomains(domainModel, res);
    });
    router.get('/locations', async (req, res) => {
        await GetLocationCount(domainModel, res);
    });
    router.get('/owners', async (req, res) => {
        await GetOwnersCount(domainModel, res);
    });

    router.delete('/domains/delete/:id', async (req, res) => {
        await DeletById(req, domainModel, res);
    });

    router.post('/domains/add', async (req, res) => {
        return await AddWithCondition(domainModel, req, res);
    });

    router.put('/domains/update/:id', async (req, res) => {
        return await UpdateWithCondition(req, domainModel, res);
    });

    router.get('/domains/:id', async (req, res) => {
        return await GetOneById(domainModel, req, res);
    });

    return router; 
}

module.exports = domainsRouter;


//functions
async function GetDomains(domainModel, res) {
    try {
        const domains = await domainModel.getDomains();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetMasterIpsAverage(domainModel, res) {
    try {
        const domains = await domainModel.getMasterIpAverage();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetMasterIpsCount(domainModel, res) {
    try {
        const domains = await domainModel.getMasterIpCount();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetExpireingDomains(domainModel, res) {
    try {
        const domains = await domainModel.getExpiringDomains();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetRecentDomains(domainModel, res) {
    try {
        const domains = await domainModel.getRecentDomains();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetLocationCount(domainModel, res) {
    try {
        const domains = await domainModel.getLocationCount();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching Locations:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetLocationAvrage(domainModel, res) {
    try {
        const domains = await domainModel.getLocationAvrage();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching Locations:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetOwnerAvrage(domainModel, res) {
    try {
        const domains = await domainModel.getOwnersAvrage();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching Owners:', error);
        res.status(500).json({message: 'Server error'});
    }
}
async function GetOwnersCount(domainModel, res) {
    try {
        const domains = await domainModel.getOwnersCount();
        res.json(domains);
    } catch (error) {
        console.error('Error fetching Owners:', error);
        res.status(500).json({message: 'Server error'});
    }
}

async function DeletById(req, domainModel, res) {
    try {
        const id = req.params.id;
        await domainModel.deleteDomain(id);
        res.json({message: 'Domain deleted successfully'});
    } catch (error) {
        console.error('Error deleting domain:', error);
        res.status(500).json({message: 'Server error'});
    }
}

async function AddWithCondition(domainModel, req, res) {
    try {
        const existingDomain = await domainModel.findOne({
            $or: [{domain: req.body.domain}, {ip: req.body.ip}]
        });

        if (existingDomain) {
            return res.status(409).json({message: 'Domain or IP already exists'});
        }

        await domainModel.addDomain(req.body);
        return res.status(201).json({message: 'Domain added successfully'});
    } catch (error) {
        console.error('Error adding domain:', error);
        res.status(500).json({message: 'Server error'});
    }
}

async function UpdateWithCondition(req, domainModel, res) {
    try {
        const {domain, ip} = req.body;
        const existingDomain = await domainModel.findOne({$or: [{domain}, {ip}]});

        if (existingDomain && existingDomain._id.toString() !== req.params.id) {
            return res.status(400).json({message: 'Domain or IP already exists'});
        }

        await domainModel.updateDomain(req.params.id, {domain, ip});
        res.json({message: 'Domain updated successfully'});
    } catch (error) {
        console.error('Error updating domain:', error);
        res.status(500).json({message: 'Server error'});
    }
}

async function GetOneById(domainModel, req, res) {
    try {
        const domain = await domainModel.findById(req.params.id);
        if (!domain) {
            return res.status(404).json({message: 'Domain not found'});
        }
        res.json(domain);
    } catch (error) {
        console.error('Error fetching domain:', error);
        res.status(500).json({message: 'Server error'});
    }
}
