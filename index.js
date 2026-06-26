/**
 * @typedef Artist
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} imageUrl
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2605-ftb-ct-web-pt"; // Make sure to change this!
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let events = [];
let selectedEvent;

/** Updates state with all artists from the API */
async function getEvent() {
  try{
    const response = await fetch (API)
    const result = await response.json();
    events=result.data;
    render();
  }catch (e){
    console.error(e);
  }
}

/** Updates state with a single artist from the API */
async function getEvents(id) {
  try{
    const response = await fetch (API + "/" + id)
    const result = await response.json();
    selectedEvent = result.data;
    render();
  }catch (e){
    console.error(e);
  }
}

async function addEvent(event) {
    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(artist)
        })
        getEvent()  // refresh the list after adding
    } catch (error) {
        console.log(error)
    }
}


/**
 * Deletes the artist with the given ID via the API
 * @param {string | number} id
 */
async function removeEvent(id) {
     try {
        //delete from the api
        await fetch(API + "/" + id, {
            method:"DELETE",
        })
        getEvents()
      } catch (error) {  f// <-- this is required
    console.log(error)
}
} 

// === Components ===

/** Artist name that shows more details about the artist when clicked */
function EventsListItem(event) {
  const $li = document.createElement("li");
  $li.innerHTML = `
    <a href="#selected">${event.name}</a>
  `;
  $li.addEventListener("click", () => getEvents(event.id));
  return $li;
}

/** A list of names of all artists */
function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  const $events = events.map(EventsListItem);
  $ul.replaceChildren(...$events);

  return $ul;
}

/** Detailed information about the selected artist */
function EventDetails() {
  console.log(selectedEvent);
  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent = "Please select an event to learn more.";
    return $p;
  }
  const $event= document.createElement("section");
    $event.classList.add("event");
    $event.innerHTML = `
      <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
        <p><strong>Date:</strong> ${selectedEvent.date}</p>
        <p><strong>Location:</strong> ${selectedEvent.location}</p>
        <p>${selectedEvent.description}</p>
         <button>Remove event</button>
`;
  $event.querySelector("button").addEventListener("click", () => {
    removeEvent(selectedEvent.id)
})
  return $event;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party-Planner</h1>
    <main>
      <section>
        <h2>Event Lineup</h2>
        <ul id="event-list"></ul>
      </section>
      <section id="selected">
        <h2>Event Details</h2>
       <div id="event-details"></div>
      </section>
    </main>
  `;
  $app.querySelector("#event-list").replaceWith(EventList());
  $app.querySelector("#event-details").replaceWith(EventDetails());
}

async function init() {
  await getEvent();
  render();
}

init();
