import express from 'express';
import bodyParser from 'body-parser';
import connectMongo from '../utils/connect-mongo.js';

const router = express.Router();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

router.post('/readTournament', async (req, res) => {
    const { name } = req.body;
    const { collection, client } = await connectMongo('tournaments');
    try 
    {
        let tournament = await collection.findOne({
            name: name,
        });
        if(tournament)
            res.status(200).json(tournament);
        else
            res.status(404).json({ message: 'Tournament does not exist.'});
    }
    catch (error) {
        res.status(500).json({ message: 'Server error, Please try again later.' });
    }
    finally
    {
        client.close();
    }
})

export default router;