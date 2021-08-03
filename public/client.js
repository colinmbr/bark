console.log("Hello World!");

const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const barksElement = document.querySelector(".barks");
const API_URL = "http://localhost:5000/barks";

loadingElement.style.display = "";

listAllBarks();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");

  const bark = {
    name,
    content,
  };

  form.style.display = "none";
  loadingElement.style.display = "";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(bark),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((createdBark) => {
      console.log(createdBark);
      form.reset();
      setTimeout(() => {
        form.style.display = "";
      }, 30000);
      listAllBarks();
      // loadingElement.style.display = "none";
    });
});

function listAllBarks() {
  barksElement.innerHTML = "";
  // don't have to specify options when making a GET request
  fetch(API_URL)
    .then((response) => response.json())
    .then((barks) => {
      console.log(barks);
      barks.reverse();
      barks.forEach((bark) => {
        const div = document.createElement("div");

        const header = document.createElement("h3");
        header.textContent = bark.name;

        const content = document.createElement("p");
        content.textContent = bark.content;

        const date = document.createElement("small");
        date.textContent = new Date(bark.created);

        div.appendChild(header);
        div.appendChild(content);
        div.appendChild(date);

        barksElement.appendChild(div);
      });
      loadingElement.style.display = "none";
    });
}
