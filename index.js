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
import { events, attendees } from "./data/initialData.js";
import { nextEventId, nextAttendeeId } from "./data/initialData.js";

/* --------------------------

      EVENTS ENDPOINTS     

-------------------------- */

const baseUrl = `${apiPath}${version}`;

app.get(`${baseUrl}/events`, (req, res) => {
  const allowedQueryParams = ['Name', 'Location'];
  const queryKeys = Object.keys(req.query);

  const hasInvalidQuery = queryKeys.some(
    (key) => !allowedQueryParams.includes(key)
  );

  if (hasInvalidQuery) {
    return res.status(400).json({
      message: "Invalid query parameter provided"
    });
  }

  let filteredEvents = events;

  if (req.query.name) {
    const nameFilter = req.query.name.toLocaleLowerCase();
    filteredEvents = filteredEvents.filter((event) =>
      event.name.toLocaleLowerCase().includes(nameFilter)
    );
  }

  if (req.query.location) {
    const locationFilter = req.query.location.toLocaleLowerCase();
    filteredEvents = filteredEvents.filter((event) =>
      event.location.toLocaleLowerCase().includes(locationFilter)
    );
  }

  return res.status(200).json(filteredEvents)
});

app.get(`${baseUrl}/events/eventId`, (req, res) => {
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
