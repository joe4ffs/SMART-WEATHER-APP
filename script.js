function sayHello() {
  alert("Welcome to my page 🚀");
}

let projects = [
  {
    name: "Portfolio Website",
    description: "My first frontend project"
  },
  {
    name: "Todo App",
    description: "Task management app"
  },
  {
    name: "Weather App",
    description: "Shows weather data"
  }
];

let container = document.getElementById("project-list");

projects.map ((project)=> {

  let div = document.createElement("div");
  div.className = "project-card";

  let title = document.createElement("h3");
  title.innerText = project.name;

  let desc = document.createElement("p");
  desc.innerText = project.description;

  div.appendChild(title);
  div.appendChild(desc);

  div.onclick = function () {
    let detail = document.getElementById("project-detail");
    detail.innerText = project.description;
  };

  container.appendChild(div);

});

fetch("https://jsonplaceholder.typicode.com/posts")
  .then(res => res.json())
  .then(data => {

    let apiContainer = document.getElementById("api-data");

    data.slice(0, 5).map((post) => {

      let div = document.createElement("div");
      div.className = "project-card";

      let title = document.createElement("h3");
      title.innerText = post.title;

      let body = document.createElement("p");
      body.innerText = post.body;

      div.appendChild(title);
      div.appendChild(body);

      apiContainer.appendChild(div);

    });

  });