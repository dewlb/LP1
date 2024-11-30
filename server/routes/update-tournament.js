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
    const {status = 0, name, max_size, current_size, participants, tournamentID, addUser = null, deleteUser = null} = req.body;

    const inputTournament = {
        name: name,         // account for duplicate names                  <-------- L O O K
        max_size: max_size,
        current_size: current_size,
        participants: participants,
        tournamentID: tournamentID,
        status: status
    }

    try{

        // create updatedTournament object with same values as inputTournament except tournamentID so object id is not changed
        const { tournamentID, ...updatedTournament } = inputTournament;

        await t_collection.updateOne( {_id: ObjectId.createFromHexString(tournamentID)}, {$set: updatedTournament} );

        if(addUser)     //if addUser is NOT null, a user is being added
        {
            // add tournament to user's list of tournaments
            await u_collection.updateOne({_id: ObjectId.createFromHexString(addUser)}, {$push: {tournaments: tournamentID}});
        }
        if(deleteUser)      //if deleteUser is NOT null, a user is being deleted
        {
            // delete tournament from user's list of tournaments
            await u_collection.updateOne({_id: ObjectId.createFromHexString(deleteUser)}, {$pull: {tournaments: tournamentID}});
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
