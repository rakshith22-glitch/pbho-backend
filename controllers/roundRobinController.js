// backend/controllers/roundRobinController.js
import RoundRobin from '../models/RoundRobin.js';
import { getUserDetails } from '../services/userService.js';

export const createRoundRobin = async (req, res) => {
    const {
        title,
        location,
        date,
        startTime,
        endTime,
        isPublic,
        gameDescription,
        maxPlayers,
        maxRounds,
        scoringOptions,
        isRotatingPartners,
        link,
        requireDUPR,
        minRating,
        maxRating,
        submitScoresToDUPR,
        clubID,
        cost,
        format
    } = req.body;

    const roundRobin = new RoundRobin({
        title,
        location,
        date,
        startTime,
        endTime,
        isPublic,
        gameDescription,
        maxPlayers,
        maxRounds,
        scoringOptions,
        isRotatingPartners,
        link,
        requireDUPR,
        minRating,
        maxRating,
        submitScoresToDUPR,
        clubID,
        cost,
        format
    });

    await roundRobin.save();
    res.status(201).json(roundRobin);
};

export const getRoundRobins = async (req, res) => {
    const roundRobins = await RoundRobin.find().populate('players', 'name email');
    res.json(roundRobins);
};

export const getRoundRobin = async (req, res) => {
    try {
        const roundRobin = await RoundRobin.findById(req.params.id);
        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }
        res.json(roundRobin);
    } catch (error) {
        console.error('Error fetching round robin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateRoundRobin = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            location,
            date,
            startTime,
            endTime,
            isPublic,
            gameDescription,
            maxPlayers,
            maxRounds,
            scoringOptions,
            isRotatingPartners,
            link,
            requireDUPR,
            minRating,
            maxRating,
            submitScoresToDUPR,
            clubID,
            cost,
            format
        } = req.body;

        const roundRobin = await RoundRobin.findById(id);

        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }

        // Update round robin fields
        roundRobin.title = title;
        roundRobin.location = location;
        roundRobin.date = date;
        roundRobin.startTime = startTime;
        roundRobin.endTime = endTime;
        roundRobin.isPublic = isPublic;
        roundRobin.gameDescription = gameDescription;
        roundRobin.maxPlayers = maxPlayers;
        roundRobin.maxRounds = maxRounds;
        roundRobin.scoringOptions = scoringOptions;
        roundRobin.isRotatingPartners = isRotatingPartners;
        roundRobin.link = link;
        roundRobin.requireDUPR = requireDUPR;
        roundRobin.minRating = minRating;
        roundRobin.maxRating = maxRating;
        roundRobin.submitScoresToDUPR = submitScoresToDUPR;
        roundRobin.clubID = clubID;
        roundRobin.cost = cost;
        roundRobin.format = format;

        const updatedRoundRobin = await roundRobin.save();

        res.status(200).json(updatedRoundRobin);
    } catch (error) {
        console.error('Error updating round robin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteRoundRobin = async (req, res) => {
    try {
        const { id } = req.params;
        const roundRobin = await RoundRobin.findById(id);

        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }

        await RoundRobin.deleteOne({ _id: id });
        res.json({ message: 'Round Robin removed' });
    } catch (error) {
        console.error('Error deleting round robin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const signUpForRoundRobin = async (req, res) => {
    try {
        const roundRobin = await RoundRobin.findById(req.params.id);
        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }
        
        if (roundRobin.isFull()) {
            return res.status(400).json({ message: 'Round Robin is full. Joining waitlist.' });
        }
        
        if (roundRobin.isRegisteredOrWaitlisted(req.user._id)) {
            return res.status(400).json({ message: 'Already signed up or on waitlist' });
        }

        roundRobin.players.push(req.user._id);
        await roundRobin.save();
        res.json({ message: 'Successfully signed up for the Round Robin' });
    } catch (error) {
        console.error('Error signing up for round robin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const joinWaitlist = async (req, res) => {
    try {
        const roundRobin = await RoundRobin.findById(req.params.id);
        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }

        if (roundRobin.isRegisteredOrWaitlisted(req.user._id)) {
            return res.status(400).json({ message: 'Already signed up or on waitlist' });
        }

        roundRobin.waitlist.push(req.user._id);
        await roundRobin.save();
        res.json({ message: 'Added to the waitlist successfully' });
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addJoinRequest = async (req, res) => {
    const { userId } = req.body; // ID of the user sending the join request
    const { id } = req.params; // ID of the round robin tournament

    try {
        const roundRobin = await RoundRobin.findById(id);
        if (!roundRobin) {
            return res.status(404).send({ message: "Round Robin not found." });
        }

        // Check if the user is already a participant or has already requested
        if (roundRobin.players.includes(userId) || roundRobin.joinRequests.includes(userId)) {
            return res.status(400).send({ message: "User is already a participant or has already requested to join." });
        }

        // Add the user's ID to the joinRequests array
        roundRobin.joinRequests.push(userId);
        await roundRobin.save();

        res.status(200).json(roundRobin);
    } catch (error) {
        res.status(500).send({ message: "Error adding join request.", error: error.message });
    }
};

export const approveJoinRequest = async (req, res) => {
    const { userId } = req.body; // ID of the user being approved
    const { id } = req.params; // ID of the round robin tournament

    try {
        const roundRobin = await RoundRobin.findById(id);
        if (!roundRobin) {
            return res.status(404).send({ message: "Round Robin not found." });
        }

        // Check if the user is in joinRequests
        const requestIndex = roundRobin.joinRequests.indexOf(userId);
        if (requestIndex === -1) {
            return res.status(404).send({ message: "Join request not found." });
        }

        // Check if the user is already a participant
        if (roundRobin.players.includes(userId)) {
            return res.status(400).send({ message: "User is already a participant." });
        }

        // Remove user from joinRequests and add to participants
        roundRobin.joinRequests.splice(requestIndex, 1);
        roundRobin.players.push(userId);

        await roundRobin.save();

        // Fetch updated user details for response
        const updatedPlayerDetails = await getUserDetails(userId);

        res.status(200).json({
            message: "User approved and added to participants.",
            roundRobin,
            updatedPlayerDetails,
        });
    } catch (error) {
        res.status(500).send({ message: "Error approving join request.", error: error.message });
    }
};

export const addUserToRoundRobin = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const roundRobin = await RoundRobin.findById(id);
        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }

        // Check if user is already a participant
        if (roundRobin.players.includes(userId)) {
            return res.status(400).json({ message: 'User already added' });
        }

        // Add user to round robin
        roundRobin.players.push(userId);
        await roundRobin.save();
        res.status(200).json({ message: 'User added successfully', roundRobin });
    } catch (error) {
        console.error('Error adding user to round robin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeUserFromRoundRobin = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const roundRobin = await RoundRobin.findById(id);
        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }

        // Check if user is not a participant
        if (!roundRobin.players.includes(userId)) {
            return res.status(400).json({ message: 'User not found in round robin' });
        }

        // Remove user from round robin
        roundRobin.players = roundRobin.players.filter(player => player.toString() !== userId);
        await roundRobin.save();
        res.status(200).json({ message: 'User removed successfully', roundRobin });
    } catch (error) {
        console.error('Error removing user from round robin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
