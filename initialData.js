/* Initial Data */
const events = [
  {
    id: 1,
    name: "Spring Welcome Social",
    location: "Student Center Hall",
    date: "2026-03-20",
  },
  {
    id: 2,
    name: "Study Group: Web Programming",
    location: "Room B-204",
    date: "2026-03-25",
  },
  {
    id: 3,
    name: "Movie Night: Everything Everywhere All at Once",
    location: "Campus Theater",
    date: "2026-03-28",
  },
  {
    id: 4,
    name: "eSports Tournament",
    location: "Gaming Lab",
    date: "2026-04-02",
  },
];

const attendees = [
  {
    id: 1,
    name: "Jón Önnuson",
    email: "jj@example.com",
    eventIds: [1, 3],
  },
  {
    id: 2,
    name: "Maya Berg",
    email: "maya.berg@example.com",
    eventIds: [2],
  },
  {
    id: 3,
    name: "Anna Alfreðsdóttir",
    email: "anna.alfreds@example.com",
    eventIds: [1, 2, 4],
  },
  { id: 4, name: "Elín Ósk", email: "elin.osk@example.com", eventIds: [] },
];

/*  Our id counters
    We use basic integer ids in this assignment, but other solutions (such as UUIDs) would be better. */
let nextEventId = 5;
let nextAttendeeId = 5;

export const getNextEventId = () => nextEventId++;
export const getNextAttendeeId = () => nextAttendeeId++;

export {
  events,
  attendees,
};
