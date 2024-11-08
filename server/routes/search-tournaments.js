import express from 'express';
import bodyParser from 'body-parser';
import connectMongo from '../utils/connect-mongo.js';

const router = express.Router();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

router.post('/searchTournaments', async (req, res) => {
    const { name, page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;
    const regex = { name: { $regex: name, $options: 'i' } };

    const { collection, client } = await connectMongo('tournaments');

    try
    {
        //lots of parameters for lazy loading 
        const tournaments = await collection.find(regex, { projection: { name: 1 } })
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalCount = await collection.countDocuments(regex);
        const pageTotal = Math.ceil(totalCount / limit);

        const response = {
            tournaments: tournaments,
            pageTotal: pageTotal
        };

        res.status(200).json(response);
    }
    catch(error)
    {
        res.status(500).json({ message: 'Server error, Please try again later.' });
    }
    finally
    {
        client.close();
    }
})

export default router;