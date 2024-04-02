const { ObjectId } = require('mongodb');
const {getDb} = require("./db");

function createDomainModel() {
    const db = getDb();
    const collection = db.collection('Domain_Ip');

    async function getDomains() {
        try {
            const domains = await collection.aggregate([
                {
                    $project: {
                        domain: 1,
                        ip: 1,
                        _id: 1
                    }
                }
            ]).toArray();
            return domains;
        } catch (error) {
            console.error('Error fetching domains:', error);
            throw error;
        }
    }
    async function addDomain(domainData) {
        try {
            await collection.insertOne(domainData);
            console.log('Domain added successfully');
        } catch (error) {
            console.error('Error adding domain:', error);
            throw error;
        }
    }

    async function updateDomain(id, domainData) {
        try {
            await collection.updateOne({ _id: new ObjectId(id) }, { $set: domainData });
            console.log('Domain updated successfully');
        } catch (error) {
            console.error('Error updating domain:', error);
            throw error;
        }
    }

    async function deleteDomain(id) {
        try {
            await  collection.deleteOne({_id: new ObjectId(id)});
            console.log('Domain deleted successfully');
        } catch (error) {
            console.error('Error deleting domain:', error);
            throw error;
        }
    }

    async function findOne(query) {
        try {
            return await collection.findOne(query);
        } catch (error) {
            console.error('Error finding domain:', error);
            throw error;
        }
    }

    async function findById(id) {
        try {
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            console.error('Error finding domain by ID:', error);
            throw error;
        }
    }

    return {
        addDomain,
        updateDomain,
        deleteDomain,
        findById,
        findOne,
        getDomains,
    };
}

module.exports = createDomainModel;

