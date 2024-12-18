import express from 'express';
import connectMongo from '../utils/connect-mongo.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/searchTournaments', async (req, res) =>
{
    const { objectId = null, name = null, userId = null, page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;

    const { collection, client } = await connectMongo('tournaments');

    try
    {
        let filter = {};

        if (name && name.trim() !== '') 
        {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (userId) 
        {
            filter.owner = userId;
        }
        if (objectId)
        {
            filter._id = ObjectId.createFromHexString(objectId);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        filter.start = { $gte: today.toISOString().split('T')[0] };

        const tournaments = await collection.find(filter)
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalCount = await collection.countDocuments(filter);

        const pageTotal = Math.ceil(totalCount / limit);

        const response = {
            tournaments: tournaments,
            pageTotal: pageTotal,
        };

        res.status(200).json(response);
    }
    catch (error)
    {
        console.log('Error', error);
        res.status(500).json({ error: 'Server error, Please try again later.' });
    }
    finally
    {
        client.close();
    }
})

export default router;