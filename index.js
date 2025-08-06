// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2507-nvila"; // Make sure to change this!

const API = BASE + COHORT;

// console.log(API);

// === State ===
let puppies = [];
let selectedPuppy;

// Pull from the API and store the date in puppies[]
const getAllPuppies = async () => {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    puppies = result.data.players;
    render();
  } catch (error) {
    console.log(error);
  }
};

const getPuppy = async (id) => {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    selectedPuppy = result.data.player;
    render();
  } catch (error) {
    console.log(error);
  }
};

const addNewPuppy = async (puppy) => {
  try {
    const response = await fetch(API + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(puppy),
    });
    // additional actions here
    getAllPuppies();
    render();
  } catch (error) {}
};

const removePuppy = async (id) => {
  try {
    const response = await fetch(API + "/players/" + id, {
      method: "DELETE",
    });
    selectedPuppy = "";
    init();
  } catch (error) {
    console.log(error);
  }
};

// make a list item for the puppy
const puppyListItem = (puppy) => {
  //   const $li = document.createElement("li");
  //   if (puppy.id === selectedPuppy?.id) {
  //     $li.classList.add("selected");
  //   }

  //   $li.innerHTML = `
  //     <img src="${puppy.imageUrl}" alt="${puppy.name}" class="puppy-icon" />
  //     <a href="#selected">${puppy.name}</a>
  //   `;
  //   $li.addEventListener("click", () => getPuppy(puppy.id));
  //   return $li;

  const $a = document.createElement("a");
  if (puppy.id === selectedPuppy?.id) {
    $a.classList.add("selected");
  }

  $a.href = "#selected";
  $a.innerHTML = `<img src="${puppy.imageUrl}" alt="${puppy.name}" class="puppy-icon"/> <p>${puppy.name}</p>`;

  $a.addEventListener("click", () => getPuppy(puppy.id));
  // ask Aaron or Javier about the scroll resetting. preventDefault() does not work here.

  return $a;
};

/** A list of all the puppies (players) */
const listAllPuppies = () => {
  const $ul = document.createElement("ul");
  $ul.classList.add("puppies");

  const $puppies = puppies.map(puppyListItem);
  $ul.replaceChildren(...$puppies);

  return $ul;
};

const SelectedPuppy = () => {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Select a puppy to learn more!";
    return $p;
  }

  const $puppy = document.createElement("section");
  $puppy.classList.add("puppy-details");

  $puppy.innerHTML = `
        <img src="${selectedPuppy.imageUrl}" alt="${selectedPuppy.name}" class="selected-img" />
        <p><strong>Name:</strong> ${selectedPuppy.name}</p>
        <p><strong>ID:</strong> ${selectedPuppy.id}</p>
        <p><strong>Breed:</strong> ${selectedPuppy.breed}</p>
        <p><strong>Team:</strong> ${selectedPuppy.teamId}</p>
        <p><strong>Status:</strong> ${selectedPuppy.status}</p>
        <!-- how do I capitalize the first letter? -->
        <button>Remove from roster</button>    
    `;
  const removeButton = $puppy.querySelector("button");
  removeButton.addEventListener("click", () => {
    console.log("Click!");
    removePuppy(selectedPuppy.id);
  });

  return $puppy;
};

const newPuppyForm = () => {
  const $form = document.createElement("form");
  $form.innerHTML = `
        <label>
            Name
            <input name="name" required/>
        </label>

        <label>
            Breed
            <input name="breed" required/>
        </label>

        <label>
            Status
            <select name="status" id="status" required>
                <option value="field">Field</option>
                <option value="bench">Bench</option>
                <!--<option value="derpy">Derpy</option>-->
            </select>
        </label>

        <label>
            Photo URL
            <input name="image" required/>
        </label>
        <button id="submit-button">Add Puppy</button>
    `;

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e);
    let userInput = {
      name: e.target[0].value,
      breed: e.target[1].value,
      status: e.target[2].value,
      imgUrl: e.target[3].value,
      teamId: 8209,
    };
    addNewPuppy(userInput);
  });
  return $form;
};

const render = () => {
  const $app = document.getElementById("app");
  $app.innerHTML = `
        <h1>Welcome to the PUPPY BOWL</h1>
        <main>
            <section>
                <h2>SELECT YOUR PUPPY</h2>
                <PuppyList></PuppyList>
                <h3>ADD A NEW PUP!</h3>
                <NewPuppyForm></NewPuppyForm>
            </section>
            <section id="selected">
                <h2>PUPPY DEETS</h2>
                <SelectedPuppy></SelectedPuppy>
        </main>
    `;

  $app.querySelector("PuppyList").replaceWith(listAllPuppies());
  $app.querySelector("NewPuppyForm").replaceWith(newPuppyForm());
  $app.querySelector("SelectedPuppy").replaceWith(SelectedPuppy());
};

async function init() {
  await getAllPuppies();
  // console.log(puppies);
  render();
}

init();
