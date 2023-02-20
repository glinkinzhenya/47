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


// отправить
async function post(path, obj) {
    await controller("POST", `${API}/${path}`, {
        name: obj.name,
        comics: obj.comics,
        favourite: obj.favourite,
    })
}


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


// удаляем героев
// async function deletePerson(number) {
//     const data = await controller("DELETE", `${API}/heroes/${number}`);
// }


// Кнопка добавить героя
const button = document.getElementById("button");
const heroName = document.getElementById("heroName");
const heroFavourite = document.getElementById("heroFavourite");

button.addEventListener("click", async (e) => {

    e.preventDefault();
    console.log(heroName.value);
    console.log(heroComics.value);
    console.log(heroFavourite.checked);

    const data = await controller("GET", `${API}/heroes`);
    console.log(data);

    if (data.find(i => i.name === heroName.value)) {
        alert(`${heroName.value} уже существует`)
    } else {
        await post("heroes", { name: heroName.value, comics: heroComics.value, favourite: heroFavourite.checked });
        persons.innerHTML = ""
        getRenders()
    }
});

// изменить данные

async function putPerson(number, check) {
    const data = await controller("PUT", `${API}/heroes/${number}`, {
        favourite: check,
    })
}


// Получить данные и отрендерить
async function getRenders() {
    const data = await controller("GET", `${API}/heroes`);
    console.log(data);

    const persons = document.getElementById("persons");
    data.forEach(element => {

        const tr = document.createElement("tr");

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

        input.setAttribute("id", `${element.id}`);
        const id = document.getElementById(`${element.id}`);
        input.addEventListener("click", () => {
            putPerson(element.id, document.getElementById(`${element.id}`).checked)
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
        button.addEventListener("click", async () => {
            // await deletePerson(element.id);
            await controller("DELETE", `${API}/heroes/${element.id}`)


            persons.innerHTML = ""
            getRenders()
        });

        persons.append(tr);
    });
}
getRenders()





