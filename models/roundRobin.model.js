// models/RoundRobin.js
import mongoose from 'mongoose';

const roundRobinSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isPublic: { type: Boolean, required: false },
    gameDescription: { type: String, required: true },
    maxPlayers: { type: Number, required: true },
    maxRounds: { type: Number, required: true },
    scoringOptions: { type: String, required: false },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isRotatingPartners: { type: Boolean, required: true },
    isRecurring: { type: Boolean, required: false },
    requireDUPR: { type: Boolean, required: false },
    minRating: { type: Number },
    maxRating: { type: Number },
    submitScoresToDUPR: { type: Boolean, required: false },
    clubID: { type: String },
    link: { type: String, required: false },
    cost: {type: Number, required: false }
}, { timestamps: true });

// Add a method to check if the Round Robin is full
roundRobinSchema.methods.isFull = function () {
    return this.players.length >= this.maxPlayers;
};

const RoundRobin = mongoose.model('RoundRobin', roundRobinSchema);
export default RoundRobin;
