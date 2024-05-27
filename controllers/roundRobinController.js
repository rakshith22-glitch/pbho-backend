// backend/controllers/roundRobinController.js
import RoundRobin from '../models/roundRobin.model.js'


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
        courts,
        isRotatingPartners,
        link,
        requireDUPR,
        minRating,
        maxRating,
        submitScoresToDUPR,
        clubID,
        cost
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
        courts,
        isRotatingPartners,
        link,
        requireDUPR,
        minRating,
        maxRating,
        submitScoresToDUPR,
        clubID,
        cost
    });

    await roundRobin.save();
    res.status(201).json(roundRobin);
};

export const getRoundRobins = async (req, res) => {
    const roundRobins = await RoundRobin.find().populate('players', 'name email');
    res.json(roundRobins);
};

export const signUpForRoundRobin = async (req, res) => {
    const roundRobin = await RoundRobin.findById(req.params.id);
    if (roundRobin) {
        if (!roundRobin.players.includes(req._id)) {
            roundRobin.players.push(req._id);
            await roundRobin.save();
            res.json({ message: 'Successfully signed up for the Round Robin' });
        } else {
            res.status(400).json({ message: 'Already signed up' });
        }
    } else {
        res.status(404).json({ message: 'Round Robin not found' });
    }
};

export const getUserRegistrations = async (req, res) => {
    try {
      const userId = req.params.userId;
      const registrations = await Registration.find({ user: userId }); // Adjust based on how your data schema is set up
  
      res.json(registrations);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      res.status(500).json({ message: "Error fetching user registrations" });
    }
  };

  export const getRoundRobin = async (req, res) => {
    const roundRobin = await RoundRobin.findById(req.params.id);
    if (!roundRobin) {
        res.status(404).json({ message: 'Round Robin not found' });
    } else {
        res.json(roundRobin);
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
            courts,
            isRotatingPartners,
            link,
            requireDUPR,
            minRating,
            maxRating,
            submitScoresToDUPR,
            clubID,
            cost,
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
        roundRobin.courts = courts;
        roundRobin.isRotatingPartners = isRotatingPartners;
        roundRobin.link = link;
        roundRobin.requireDUPR = requireDUPR;
        roundRobin.minRating = minRating;
        roundRobin.maxRating = maxRating;
        roundRobin.submitScoresToDUPR = submitScoresToDUPR;
        roundRobin.clubID = clubID;
        roundRobin.cost = cost;

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

export const joinRoundRobin = async (req, res) => {
    try {
        const roundRobin = await RoundRobin.findById(req.params.id);
        if (!roundRobin) {
            return res.status(404).json({ message: 'Round Robin not found' });
        }
        
        if (roundRobin.players.length >= roundRobin.maxPlayers) {
            return res.status(400).json({ message: 'Round Robin is full. Joining waitlist.' });
        }
        
        if (roundRobin.players.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already signed up' });
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

        if (roundRobin.waitlist.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already on waitlist' });
        }

        roundRobin.waitlist.push(req.user._id);
        await roundRobin.save();
        res.json({ message: 'Added to the waitlist successfully' });
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// RoundRobinController.js
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

// RoundRobinController.js
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

// POST: Add a join request to the round robin
exports.addJoinRequest = async (req, res) => {
    const { userId } = req.body; // ID of the user sending the join request
    const { id } = req.params; // ID of the round robin tournament

    try {
        const roundRobin = await RoundRobin.findById(id);
        if (!roundRobin) {
            return res.status(404).send({ message: "Round Robin not found." });
        }

        // Check if the user is already a participant or has already requested
        if (roundRobin.participants.includes(userId) || roundRobin.joinRequests.includes(userId)) {
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

// POST: Approve a join request
exports.approveJoinRequest = async (req, res) => {
    const { userId } = req.body; // ID of the user being approved
    const { id } = req.params; // ID of the round robin tournament

    try {
        const roundRobin = await RoundRobin.findById(id);
        if (!roundRobin) {
            return res.status(404).send({ message: "Round Robin not found." });
        }

        // Remove user from joinRequests and add to participants
        const index = roundRobin.joinRequests.indexOf(userId);
        if (index > -1) {
            roundRobin.joinRequests.splice(index, 1);
            roundRobin.participants.push(userId);
            await roundRobin.save();
            res.status(200).json(roundRobin);
        } else {
            res.status(404).send({ message: "Join request not found." });
        }
    } catch (error) {
        res.status(500).send({ message: "Error approving join request.", error: error.message });
    }
};
