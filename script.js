const API = "https://63f0efbb5b7cf4107e299645.mockapi.io";

async function controller(type = "GET", action, body) {
    const params = {
        method: type,
        headers: {
            'Content-Type': "application/json",
        }
    }
    if (body) {
        params.body = JSON.stringify(body);
    }
    const response = await fetch(action, params);
    const data = await response.json();
    return data;
};

// получаем категории
const heroComics = document.getElementById("heroComics");

async function getСategories() {
    const data = await controller("GET", `${API}/universes`);
    data.forEach(element => {
        const option = document.createElement("option");
        option.setAttribute("value", `${element.name}`);
        option.innerText = `${element.name}`
        heroComics.append(option);
    });
}
getСategories()

// Кнопка добавить героя
const button = document.getElementById("heroesForm");

const heroName = document.getElementById("heroName");
const heroFavourite = document.getElementById("heroFavourite");

button.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = await controller("GET", `${API}/heroes`);

    if (data.find(i => i.name === heroName.value)) {
        alert(`${heroName.value} уже существует`)
    } else {
        const response = await controller("POST", `${API}/heroes`, {
            name: heroName.value,
            comics: heroComics.value,
            favourite: heroFavourite.checked,
        })
        getPerson(response);
    }
});


// Запрос с сервера всех персонажей
async function getRenders() {

    const data = await controller("GET", `${API}/heroes`);

    if (data.length !== 0) {
        data.forEach(element => {
            getPerson(element);
        })
    }
}

// Отрендерить персонажа
async function getPerson(element) {

    const persons = document.getElementById("persons");

    const tr = document.createElement("tr");

    tr.id = `${element.id}`;

    const tdName = document.createElement("td");
    tdName.innerText = `${element.name}`
    tr.append(tdName);

    const tdComics = document.createElement("td");
    tdComics.innerText = `${element.comics}`
    tr.append(tdComics);

    const tdFavourite = document.createElement("td");
    const label = document.createElement("label");
    label.classList.add("heroFavouriteInput");
    label.innerText = `Favourite:`;
    const input = document.createElement("input");

    input.addEventListener("click", async () => {
        const data = await controller("PUT", `${API}/heroes/${element.id}`, {
            favourite: input.checked,
        })
    });

    input.setAttribute("type", `checkbox`);
    if (element.favourite === true) input.setAttribute("checked", "");

    label.append(input);
    tdFavourite.append(label);
    tr.append(tdFavourite);

    const tdButton = document.createElement("td");
    const button = document.createElement("button");
    button.innerText = `Delete`;
    tdButton.append(button);
    tr.append(tdButton);
    button.addEventListener("click", () => {

        controller("DELETE", `${API}/heroes/${element.id}`)
        document.getElementById(element.id).remove();
    });

    persons.prepend(tr);
}
getRenders()