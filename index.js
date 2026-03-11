/* --------------------------

   INITIAL EXPRESS CONFIG  
   (Middleware, CORS, JSON)

-------------------------- */

import express, { json } from "express";

/* Use cors to avoid issues with testing on localhost */
import cors from "cors";

const app = express();

/* Base url parameters and port settings */
const apiPath = "/api/";
const version = "v1";
const port = 3000;

/* Set Cors-related headers to prevent blocking of local requests */
app.use(json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* Initial Data */
import { events, attendees, getNextEventId } from "./data/initialData.js";
import { nextEventId, nextAttendeeId } from "./data/initialData.js";

/* --------------------------

      EVENTS ENDPOINTS     

-------------------------- */

const baseUrl = `${apiPath}${version}`;

//Get all events

app.get(`${baseUrl}/events`, (req, res) => {
  return res.status(200).json(events);
});

//Create an event

app.post(`${baseUrl}/events`, (req, res) => {
  let {name, location, date} = req.body;

  if (name === undefined || location === undefined || date === undefined ||
      typeof name != "string" || typeof location !== "string" || typeof date !== "string") {
    return res.status(400).json({message: "name, location and date are required strings."});
    }
  
  name = name.trim();
  location = location.trim();
  date = date.trim();

  if (!name || !location || !date) {
    return res.status(400).json({message: "name, location, and date must be non-empty." });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({message: "date must be in format YYYY-MM-DD."});
  }

  const duplicate = events.find((e) =>
    e.name.toLowerCase() === name.toLowerCase() &&
    e.location.toLowerCase() === location.toLowerCase() &&
    e.date === date
  );

  if (duplicate) {
    return res.status(400).json({message: "an event with the same name location and date already exists." });
  }

  const newEvent = {id: getNextEventId(), name, location, date };
  events.push(newEvent);

  return res.status(201).json(newEvent);
});


//partially update an event
app.patch(`${baseUrl}/events/:eventId`, (req, res) => {
  const eventId = Number(req.params.eventId);

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({
      message: "Event id must be valid integer",
    });
  }

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  const attendeeCount = attendees.filter((attendee) => 
    attendee.eventIds.includes(eventId)
  ).length;

  const eventWithCount = {
    ...event,
    attendeeCount,
  };

  return res.status(200).json(eventWithCount);

});

// Delete all-events request should be rejected (method not allowed)
app.delete(`${baseUrl}/events`, (req, res) => {
  return res.status(405).json({ message: "Method Not Allowed" });
});

// Delete a specific event
app.delete(`${baseUrl}/events/:eventId`, (req, res) => {
  const eventId = Number(req.params.eventId);

  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ message: "Event id must be valid integer" });
  }

  const index = events.findIndex((e) => e.id === eventId);
  if (index === -1) {
    return res.status(404).json({ message: "Event not found" });
  }

  // ensure no attendees are registered
  const hasAttendees = attendees.some((att) => att.eventIds.includes(eventId));
  if (hasAttendees) {
    return res.status(400).json({ message: "Event has registered attendees" });
  }

  const [deletedEvent] = events.splice(index, 1);
  return res.status(200).json(deletedEvent);
});


/* --------------------------

    ATTENDEES ENDPOINTS    

-------------------------- */

app.get(`${baseUrl}/attendees`, (req, res) => {
  return res.status(200).json(attendees);
});

/* --------------------------

      SERVER INITIALIZATION  
      
!! DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) !!
      
-------------------------- */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
