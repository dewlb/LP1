import express from 'express';
import connectMongo from '../utils/connect-mongo.js';

const router = express.Router();

router.post('/searchTournaments', async (req, res) => {
    const { name = null, userId = null, page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;

    const { collection, client } = await connectMongo('tournaments');

    try
    {
        let filter = {};

        if (name && name.trim() !== '') 
        {
            filter.name = { $regex: name, $options: 'i' };
        } 
        else if (userId) 
        {
            filter.owner = userId;
        }

        const tournaments = await collection.find(filter, { projection: { name: 1 } })
            .skip(skip)
            .limit(limit)
            .toArray();
        
        const totalCount = await collection.countDocuments(filter);

        const pageTotal = Math.ceil(totalCount / limit);

        const response = {
            tournaments: tournaments,
            pageTotal: pageTotal,
            error: ''
        };

        res.status(200).json(response);
    }
    catch(error)
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