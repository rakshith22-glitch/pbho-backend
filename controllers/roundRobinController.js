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