import express from 'express';
import { ObjectId } from 'mongodb';
import connectMongo from '../utils/connect-mongo';

const router = express.Router();

// updateTournament endpoint
router.post('/updateTournament', async(req, res) => {

    // mongodb connection
    const {t_collection, client} = await connectMongo('tournaments');
    const {u_collection, client2} = await connectMongo('users');
    
    //change this so that max_size cant be changed
    const {name, max_size, current_size, participants, tournamentID, addUser = null, deleteUser = null} = req.body;

    const inputTournament = {
        name: name,         // account for duplicate names
        max_size: max_size,
        current_size: current_size,
        participants: participants,
        tournamentID: tournamentID
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

        res.status(200).json({message: "Tournament updated succesfully"});
    }
    catch(error){
        console.log("Error updating tournament: ", error);
        res.status(401).json({message: "Error updating tournament"});
    }
    finally{
        await client.close();
        await client2.close();
        console.log("MongoDB connection closed");
    }
});

export default router;
