import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

// updateTournament endpoint
router.post('/updateTournament', async(req, res) => {

    // mongodb connection
    const {collection, client} = await connectMongo('tournaments');
    
    //change this so that max_size cant be changed              <------- L O O K
    const {name, max_size, current_size, participants, tournamentID, addUser = null, deleteUser = null} = req.body;

    const inputTournament = {
        name: name,         // account for duplicate names
        max_size: max_size,
        current_size: current_size,
        participants: participants,
        tournamentID: tournamentID
    }

    try{

        if(addUser)     //if addUser is NOT null, a user is being added         <--------- L O O K
        {
            // add this tournament to the user's list of tournaments
        }
        if(deleteUser)      //if deleteUser is NOT null, a user is being deleted
        {
            // delete this tournmanet from the user's list of tournaments
        }

        // create updatedTournament object with same values as inputTournament except tournamentID so object id is not changed
        const { tournamentID, ...updatedTournament } = inputTournament;

        await collection.updateOne( {_id: ObjectId.createFromHexString(tournamentID)}, {$set: updatedTournament} );

        res.status(200).json({message: "Tournament updated succesfully"});
    }
    catch(error){
        console.log("Error updating tournament: ", error);
        res.status(401).json({message: "Error updating tournament"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
});

export default router;
