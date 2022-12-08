const getPokemonTypesFormatted = (arrayTypes) => {
  const types = arrayTypes.map(({ type }) => {
    return type.name;
  });

  let str = '';
  types.forEach((type, index) => {
    if (index < types.length - 1) {
      str += type + ', ';
    } else {
      str += type;
    }
  });
  return str;
};

const handleSelect = () => {
  const select = document.getElementById('select');
  const option = select.options[select.selectedIndex];

  const input = document.getElementById('search');
  input.value = option.value;
  search();
};

const searchSameTypePokemons = (pokemonTypes) => {
  const responses = [];
  pokemonTypes.forEach(({ type }) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', `${type.url}`, true);
    httpRequest.responseType = 'json';
    httpRequest.send();
    httpRequest.addEventListener('readystatechange', () => {
      if (httpRequest.readyState === 4) {
        responses.push(httpRequest.response);
      }
    });
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (responses.length === pokemonTypes.length) {
        resolve(responses);
      } else {
        reject('error');
      }
    }, 500);
  });
};

const getDataOfPokemonsWithSameType = (samplePokemonsWithSameType) => {
  const pokemonsWithSameType = [];
  samplePokemonsWithSameType.forEach(({ pokemon }) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', `${pokemon.url}`, true);
    httpRequest.responseType = 'json';
    httpRequest.send();
    httpRequest.addEventListener('readystatechange', () => {
      if (httpRequest.readyState === 4) {
        pokemonsWithSameType.push(httpRequest.response);
      }
    });
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (pokemonsWithSameType.length === samplePokemonsWithSameType.length) {
        resolve(pokemonsWithSameType);
      } else {
        reject('error');
      }
    }, 500);
  });
};

const formatResponseSameTypePokemons = async (responses, name) => {
  const data = [];
  responses.forEach(async (type, index) => {
    const samplePokemonsWithSameType = type.pokemon.filter(
      ({ pokemon }, index) =>
        index % 3 === 0 && index < 12 && pokemon.name !== name
    );
    const pokemonsWithSameType = await getDataOfPokemonsWithSameType(
      samplePokemonsWithSameType
    );

    const pokemonToAdd = {
      typeName: type.name,
      pokemons: pokemonsWithSameType.map((pokemon) => {
        return {
          name: pokemon.name,
          image: pokemon.sprites.front_default,
        };
      }),
    };
    data.push(pokemonToAdd);
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.length === responses.length) {
        resolve(data);
      } else {
        reject('error');
      }
    }, 500);
  });
};

const search = () => {
  const divSameTypePokemons = document.getElementById('sametype-div');
  const sectionSameTypePokemons = document.getElementById('sametype-section');
  divSameTypePokemons.innerHTML = '';
  sectionSameTypePokemons.classList.add('hidden');
  const httpRequest = new XMLHttpRequest();
  const pokemonInput = document.getElementById('search');
  httpRequest.open(
    'GET',
    `https://pokeapi.co/api/v2/pokemon/${pokemonInput.value.toLowerCase()}`,
    true
  );
  httpRequest.responseType = 'json';
  httpRequest.send();
  httpRequest.addEventListener('readystatechange', () => {
    if (httpRequest.status === 404) {
      pokemonInput.value = '';
      const divData = document.getElementById('data');
      divData.innerHTML = `
        <div class="flex gap-2 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="32" height="32" viewBox="0 0 256 256" xml:space="preserve">

            <defs>
            </defs>
            <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
              <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(229,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
              <path d="M 45 57.469 L 45 57.469 c -1.821 0 -3.319 -1.434 -3.399 -3.252 L 38.465 23.95 c -0.285 -3.802 2.722 -7.044 6.535 -7.044 h 0 c 3.813 0 6.82 3.242 6.535 7.044 l -3.137 30.267 C 48.319 56.036 46.821 57.469 45 57.469 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
              <circle cx="45" cy="67.67" r="5.42" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
            </g>
          </svg>
          <p class="text-white text-red-500 font-bold text-xl">Pokemon not find</p>
        </div>
      `;

      return;
    }

    if (httpRequest.readyState === 4) {
      const pokemonUrl = httpRequest.response.forms[0].url;

      const pokemonXmlHttp = new XMLHttpRequest();
      pokemonXmlHttp.open('GET', pokemonUrl);
      pokemonXmlHttp.responseType = 'json';
      pokemonXmlHttp.send();

      pokemonXmlHttp.addEventListener('readystatechange', async () => {
        if (pokemonXmlHttp.readyState === 4) {
          const pokemonData = pokemonXmlHttp.response;
          const pokemonNameWithoutFormat = pokemonData.pokemon.name;
          const pokemonName =
            pokemonNameWithoutFormat[0].toUpperCase() +
            pokemonNameWithoutFormat.substr(1);
          const pokemonTypes = getPokemonTypesFormatted(pokemonData.types);
          const sameTypePokemonsResponses = await searchSameTypePokemons(
            pokemonData.types
          );
          const sameTypePokemonsData = await formatResponseSameTypePokemons(
            sameTypePokemonsResponses,
            pokemonNameWithoutFormat
          );
          const pokemonImage = pokemonData.sprites.front_default;

          const divData = document.getElementById('data');
          divData.innerHTML = `
              <div class="relative py-3 sm:max-w-xl sm:mx-auto flex flex-col items-center justify-center gap-2">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div class="absolute inset-0 bg-gradient-to-l from-cyan-400 to-blue-light-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-0 sm:rounded-3xl"></div>
                <div class="absolute inset-0 bg-gradient-to-l from-cyan-400 to-blue-light-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:rotate-6 sm:rounded-3xl"></div>
                <div class="relative px-4 py-10 bg-[#303032] shadow-lg sm:rounded-3xl sm:p-20">
                  <div id="water_animation" class="flex absolute top-1 mt-8 gap-10 justify-center left-[6.5rem]">
                    <div class="h-12 w-5 bg-gray-300 opacity-10 animate-pulse transform -rotate-12 rounded-full"></div>
                    <div class="h-12 w-5 bg-gray-300 opacity-10 animate-pulse transform rounded-full"></div>
                    <div class="h-12 w-5 bg-gray-300 opacity-10 animate-pulse transform rotate-12 rounded-full"></div>
                  </div>
                  <div class="mt-14 max-w-[24rem] grow-0 flex flex-col items-center justify-center">
                    <p class="font-bold text-white">Pokemon name: <span class="font-normal">${pokemonName}</span></p>
                    <p class="font-bold text-white">Type: <span class="font-normal">${pokemonTypes}</span></p>
                    <img src=${pokemonImage} class="w-32 h-32">
                  </div>
                </div>
              </div>
              `;

          const divSameTypePokemons = document.getElementById('sametype-div');
          const sectionSameTypePokemons =
            document.getElementById('sametype-section');
          sectionSameTypePokemons.classList.remove('hidden');
          console.log(sameTypePokemonsData);
          sameTypePokemonsData.forEach(({ typeName, pokemons }) => {
            const div = document.createElement('div');
            div.innerHTML = `
              <div class="mb-4">
                <p class="text-white font-bold text-xl">${
                  typeName[0].toUpperCase() + typeName.substr(1)
                } type</p>
                <div class="flex gap-4">
                  ${pokemons
                    .map(
                      ({ name, image }) => `
                        <div class="flex flex-col items-center justify-center gap-2 my-1">
                          <p class="text-white font-bold">Name: <span class="font-normal">${
                            name[0].toUpperCase() + name.substr(1)
                          }</span></p>
                          <img src=${image} class="w-16 h-16">
                        </div>
                      `
                    )
                    .join('')}
                </div>
              </div>
            `;
            divSameTypePokemons.appendChild(div);
          });
        }
      });
    } else {
      const divData = document.getElementById('data');
      divData.innerHTML = `
        <?xml version="1.0" encoding="UTF-8" standalone="no"?>

        <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="32" height="32" viewBox="0 0 128 128" xml:space="preserve">
          <g>
            <circle fill="#409ecd" cx="64.125" cy="64.125" r="12.031"/>
            <animate attributeName="opacity" dur="1000ms" begin="0s" repeatCount="indefinite" keyTimes="0;0.5;1" values="0;1;0"/>
          </g>
          <g>
            <path fill="#409ecd" fill-rule="evenodd" d="M64,0A64,64,0,1,1,0,64,64,64,0,0,1,64,0Zm0,19.538A44.462,44.462,0,1,1,19.538,64,44.462,44.462,0,0,1,64,19.538Z"/>
            <animate attributeName="opacity" dur="1000ms" begin="0s" repeatCount="indefinite" keyTimes="0;0.5;1" values="1;0;1"/>
          </g>
        </svg>
      `;
    }
  });
};

const inputField = document.getElementById('search');
inputField.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('button-search').click();
  }
});
