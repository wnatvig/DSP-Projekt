//imports
const express = require("express");
const router = express.Router();
const { createEvent,
        getEvent,
        removeEvent,
        getEvents,
        getParticipants,
        joinEvent,
        leaveEvent,
        getFilterEvent,
        getParticipantCount,

} = require('../services/DBfunctions');

//Create event
router.post("/", async (req, res) => {
    try {
        const result = await createEvent(req.body.event, req.body.user);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//Get events
router.get("/", async (req, res) => {
    try {
        const filters = {
            eventId: req.query.eventId,
            userId: req.query.userId,
            eventName: req.query.eventName,
            eventDate: req.query.eventDate,
            eventLocation: req.query.eventLocation
        };

        const events = await getEvents(filters);

        res.status(200).json({
            success: true,
            data: events
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//Get event
router.get("/:eventId", async (req, res) => {
    try {
        const event = await getEvent({ eventId: req.params.eventId });
        
        if (!event) {
            return res.status(404).json({
                success: false,
                error: "Event not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: event
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//Get participants
router.get("/:eventId/participants", async (req, res) => {
    try {
        const result = await getParticipants({ eventId: req.params.eventId });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//joinEvent
router.post("/:eventId/join", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.body.userId;

        const result = await joinEvent(
            { eventId: eventId },
            { userId: userId }
        );

        res.status(201).json({
            success: true,
            message: `User: ${userId} successfully joined event: ${eventId}`,
            data: result
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//leaveEvent
router.delete("/:eventId/leave", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.body.userId;

        const result = await leaveEvent(
            { eventId: eventId },
            { userId: userId }
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "User is not participating in this event"
            });
        }

        res.status(200).json({
            success: true,
            message: `User: ${userId} successfully left event: ${eventId}`
        }); 
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//Remove event
router.delete("/:eventId", async (req, res) => {
    try {
        const result = await removeEvent({ eventId: req.params.eventId });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "Event not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Event removed"
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.get("/filteredEvents", async (req, res) =>{
    const result = await getFilterEvent()
})

router.get("/:eventId/count", async (req, res) => {
    try {
        const count = await getParticipantCount({ eventId: req.params.eventId });
        res.status(200).json({
            success: true,
            count: count
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;