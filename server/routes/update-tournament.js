import express from 'express';
import { ObjectId } from 'mongodb';
import connectMongo from '../utils/connect-mongo.js';

const router = express.Router();

// updateTournament endpoint
router.post('/updateTournament', async(req, res) => {

    // mongodb connection
    const {u_collection, t_collection, client} = await connectMongo('both');

    console.log(client);
    console.log(u_collection);
    
    //change this so that max_size cant be changed
    const {status = 0, name, max_size, current_size, participants, tournamentID, addUser = null, deleteUser = null, format, sport, start, end} = req.body;

    const inputTournament = {
        name: name,
        max_size: max_size,
        current_size: current_size,
        participants: participants,
        tournamentID: tournamentID,
        status: status,
        format: format,
        sport: sport,
        start: start,
        end: end
    }

    try{

        // Exclude tournamentID from the new updated tournament
        const { tournamentID, ...updatedTournament } = inputTournament;

        // Update the tournament object
        await t_collection.updateOne( {_id: ObjectId.createFromHexString(tournamentID)}, {$set: updatedTournament} );

        // Fetch the updated tournament object
        const tournament = await t_collection.findOne(
            { _id: ObjectId.createFromHexString(tournamentID) }
        );

        if (!tournament) {
            throw new Error("Tournament not found");
        }

        if(addUser){
            // add tournament to user's list of tournaments
            await u_collection.updateOne({_id: ObjectId.createFromHexString(addUser)}, {$push: {tournaments: name}});
        }
        if(deleteUser){
            // delete tournament from user's list of tournaments
            await u_collection.updateOne({_id: ObjectId.createFromHexString(deleteUser)}, {$pull: {tournaments: name}});
        }

        res.status(200).json({message: "Tournament updated successfully"});
    }
    catch(error){
        console.log("Error updating tournament: ", error);
        res.status(401).json({error: "Error updating tournament"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
});

export default router;