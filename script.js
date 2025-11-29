// === Select DOM elements ===
const form = document.getElementById('pokemon-form');
const input = document.getElementById('pokemon-input');
const helperText = document.getElementById('input-helper');
const randomBtn = document.getElementById('random-btn');
const clearBtn = document.getElementById('clear-btn');
const errorBox = document.getElementById('error-message');
const resultSection = document.getElementById('pokemon-result');

// Base URL for the Pokémon API
const POKE_API_BASE = 'https://pokeapi.co/api/v2/pokemon/';

// === Helper: Clear error message ===
function clearError() {
    errorBox.textContent = '';
}

// === Helper: Show error message ===
function showError(message) {
    errorBox.textContent = message;
}

// === Helper: Clear Pokémon result card ===
function clearPokemonCard() {
    resultSection.innerHTML = '';
}

// === Main: Fetch Pokémon data from API ===
async function fetchPokemon(pokemonNameOrId) {
    clearError(); // remove any previous errors

    if (!pokemonNameOrId) {
        showError('Please enter a Pokémon name or ID.');
        return;
    }

    // Clean input (remove spaces, make lowercase)
    const query = pokemonNameOrId.trim().toLowerCase();

    // Basic validation: avoid empty string
    if (query.length === 0) {
        showError('Please enter a Pokémon name or ID.');
        return;
    }

    try {
        const response = await fetch(POKE_API_BASE + query);

        if (!response.ok) {
            // Error handling
            if (response.status >= 400 && response.status < 500) {
                showError('Pokémon not found. Try another name or ID.');
            } else {
                showError('Failed to fetch data from the API.');
            }
            clearPokemonCard();
            return;
        }

        const data = await response.json();
        renderPokemonCard(data); // create DOM elements with the data
    } catch (error) {
        console.error('Error while fetching Pokémon:', error);
        showError('Network error. Please check your connection and try again.');
        clearPokemonCard();
    }
}

// === Render: Create and display Pokémon card ===
function renderPokemonCard(pokemon) {
    // Remove previous Pokémon card if exists
    clearPokemonCard();

    // Extract useful data
    const name = pokemon.name;
    const id = pokemon.id;
    const height = pokemon.height;
    const weight = pokemon.weight;

    // Types (array)
    const types = pokemon.types.map(t => t.type.name);

    // Abilities (array)
    const abilities = pokemon.abilities.map(a => a.ability.name);

    // Sprite image (front_default)
    const imageUrl = pokemon.sprites.front_default;

    // === Create DOM elements ===
    const card = document.createElement('article');
    card.classList.add('pokemon-card');

    const img = document.createElement('img');
    img.src = imageUrl || '';
    img.alt = name + ' sprite';

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('pokemon-info');

    const title = document.createElement('h2');
    title.textContent = `${name} (#${id})`;

    const basicInfo = document.createElement('p');
    basicInfo.textContent = `Height: ${height} | Weight: ${weight}`;

    // Types list
    const typesTitle = document.createElement('p');
    typesTitle.textContent = 'Type(s):';

    const typesContainer = document.createElement('div');
    typesContainer.classList.add('pokemon-types');
    types.forEach(typeName => {
        const span = document.createElement('span');
        span.classList.add('badge');
        span.textContent = typeName;
        typesContainer.appendChild(span);
    });

    // Abilities list
    const abilitiesTitle = document.createElement('p');
    abilitiesTitle.textContent = 'Abilities:';

    const abilitiesContainer = document.createElement('div');
    abilitiesContainer.classList.add('pokemon-abilities');
    abilities.forEach(abilityName => {
        const span = document.createElement('span');
        span.classList.add('badge');
        span.textContent = abilityName;
        abilitiesContainer.appendChild(span);
    });

    // Append elements together
    infoDiv.appendChild(title);
    infoDiv.appendChild(basicInfo);
    infoDiv.appendChild(typesTitle);
    infoDiv.appendChild(typesContainer);
    infoDiv.appendChild(abilitiesTitle);
    infoDiv.appendChild(abilitiesContainer);

    card.appendChild(img);
    card.appendChild(infoDiv);

    // Finally, add card to the result section
    resultSection.appendChild(card);
}

// === Event: Form submit (Search Pokémon) ===
// EVENT TYPE 1: "submit"
form.addEventListener('submit', function (event) {
    event.preventDefault(); // prevent page reload
    const value = input.value;
    fetchPokemon(value);
});

// === Event: Keyup on input (helper text) ===
// EVENT TYPE 2: "keyup"
input.addEventListener('keyup', function (event) {
    const currentValue = event.target.value.trim();

    if (currentValue.length === 0) {
        helperText.textContent = 'Start typing a Pokémon name or ID...';
    } else {
        helperText.textContent = `Press Enter or click Search to find "${currentValue}".`;
    }
});

// === Event: Random Pokémon button ===
// EVENT TYPE 3: "click"
randomBtn.addEventListener('click', function () {
    clearError();
    const randomId = Math.floor(Math.random() * 898) + 1;
    input.value = randomId; // show the random ID in the input
    fetchPokemon(randomId);
});

// === Event: Clear button ===
// ANOTHER "click" event (shows DOM removal)
clearBtn.addEventListener('click', function () {
    clearError();
    clearPokemonCard();
    input.value = '';
    helperText.textContent = 'Start typing a Pokémon name or ID...';
});
