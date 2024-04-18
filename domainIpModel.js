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
                        location: 1,
                        owner: 1,
                        duration: 1,
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
    async function getExpiringDomains() {
        try {
            return await collection.aggregate([
                {
                    $project: {
                        domain: 1,
                        ip: 1,
                        duration: { $toInt: "$duration" },
                        _id: 1
                    }
                }, {
                    $match: {
                        duration: {$lt: 10} // Filter documents with duration less than 10
                    }
                }
            ]).toArray();
        } catch (error) {
            console.error('Error fetching domains:', error);
            throw error;
        }
    }
    async function getRecentDomains() {
        try {
            const recentDomains = await collection.aggregate([
                {
                    $project: {
                        domain: 1,
                        ip: 1,
                        _id: 1
                    }
                },
                {
                    $sort: {
                        _id: -1 
                    } 
                },
                {
                    $limit : 10
                }
            ]).toArray();
            return recentDomains;
        } catch (error) {
            console.error('Error fetching domains:', error);
            throw error;
        }
    }
    async function getLocationCount() {
        try {
            const LocationsCursor = await collection.aggregate([
                {
                    $group: {
                        _id: "$location",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        location: "$_id",
                        count: { $toString: "$count" }
                    }
                }
            ]);
            return LocationsCursor.toArray();
        } catch (error) {
            console.error('Error fetching Locations:', error);
            throw error;
        }
    }   
    async function getMasterIpAverage() {
        try {
            const masterIpAverage = await collection.aggregate([
                {
                    $addFields: {
                        firstIPNumber: {
                            $toInt: {
                                $arrayElemAt: [{ $split: ["$ip", "."] }, 0] // Extract the first part of the IP address
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$firstIPNumber", // Group by the first number in the IP address
                        count: { $sum: 1 },
                        avgDuration: { $avg: { $toInt: "$duration" } }, // Calculate average duration
                        totalDuration: { $sum: { $toInt: "$duration" } } // Calculate total duration
                    }
                },
                {
                    $project: {
                        _id: 0,
                        firstIPNumber: "$_id",
                        count: { $toString: "$count" },
                        avgDuration: { $toString: "$avgDuration" },
                        totalDuration: { $toString: "$totalDuration" }
                    }
                }
            ]);


             // Convert the cursor to an array
            return await masterIpAverage.toArray();

        } catch (error) {
            console.error('Error fetching Locations:', error);
            throw error;
        }
    }       
    async function getMasterIpCount() {
        try {
            const masterIpCount = await collection.aggregate([
                {
                    $addFields: {
                        firstIPNumber: {
                            $toInt: {
                                $arrayElemAt: [{ $split: ["$ip", "."] }, 0] // Extract the first part of the IP address
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$firstIPNumber", // Group by the first number in the IP address
                        count: { $sum: 1 },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        firstIPNumber: "$_id",
                        count: { $toString: "$count" },
                    }
                }
            ]);


             // Convert the cursor to an array
            return await masterIpCount.toArray();

        } catch (error) {
            console.error('Error fetching Locations:', error);
            throw error;
        }
    }   
    async function getLocationAvrage() {
        try {
            const LocationsCursor = await collection.aggregate([
                {
                    $group: {
                        _id: "$location",
                        avgDuration: { $avg: { $toInt: "$duration" } }, // Calculate average duration
                        totalDuration: { $sum: { $toInt: "$duration" } } // Calculate total duration
                    }
                },
                {
                    $project: {
                        _id: 0,
                        location: "$_id",
                        avgDuration: { $toString: "$avgDuration" },
                        totalDuration: { $toString: "$totalDuration" }
                    }
                }
            ]);


             // Convert the cursor to an array
            return await LocationsCursor.toArray();

        } catch (error) {
            console.error('Error fetching Locations:', error);
            throw error;
        }
    }       
    async function getOwnersAvrage() {
        try {
            const OwnerCursor = await collection.aggregate([
                {
                    $group: {
                        _id: "$owner",
                        avgDuration: { $avg: { $toInt: "$duration" } }, // Calculate average duration
                        totalDuration: { $sum: { $toInt: "$duration" } } // Calculate total duration
                    }
                },
                {
                    $project: {
                        _id: 0,
                        owner: "$_id",
                        avgDuration: { $toString: "$avgDuration" },
                        totalDuration: { $toString: "$totalDuration" }
                    }
                }
            ]);


             // Convert the cursor to an array
            return await OwnerCursor.toArray();

        } catch (error) {
            console.error('Error fetching Locations:', error);
            throw error;
        }
    }   
    async function getOwnersCount() {
        try {
            const OwnersCursor = await collection.aggregate([
                {
                    $group: {
                        _id: "$owner",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        owner : "$_id",
                        count: { $toString: "$count" }
                    }
                }
            ]);
            return OwnersCursor.toArray();
        } catch (error) {
            console.error('Error fetching owners:', error);
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
        getRecentDomains,
        getLocationCount,
        getOwnersCount,
        getExpiringDomains,
        getLocationAvrage,
        getOwnersAvrage,
        getMasterIpAverage,
        getMasterIpCount,
    };
}

module.exports = createDomainModel;

