//1
console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// //2.1
// const navLinks = $$("nav a");

// //2.2
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// //2.3
// currentLink.classList.add('current');

// if (currentLink) {
//   // or if (currentLink !== undefined)
//   currentLink?.classList.add('current');
// }

//3.1
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact'},
  { url: 'https://github.com/SongSu-eight', title: 'Profile'},
  { url: 'resume/', title: 'Resume'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  // next step: create link and add it to nav
  if (!url.startsWith('http')) {
  url = BASE_PATH + url;}
  //
  //nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
  //3.2
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
   a.classList.add('current');
  }
  if (a.host !== location.host) {
   a.target = "_blank"
  }


  nav.append(a);
}

//4.2

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme" >
		Theme:
		<select>
			<option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
		</select>
	</label>`,
);

//4.4 4.5
let select = document.querySelector(".color-scheme select");

if("colorScheme" in localStorage){
    select.value = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
} else {
  document.documentElement.style.setProperty('color-scheme', select.value);
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  localStorage.colorScheme = event.target.value
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  
});

//5
const form = document.querySelector("form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  let params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = `${form.action}?${params.join("&")}`;
  location.href = url;
});


export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
      console.log(response);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  // Your code will go here
  if (!containerElement) {
    throw new Error(`${containerElement} not found`);
  }
  containerElement.innerHTML = '';
  if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(headingLevel)) {
    headingLevel = 'h2'
  }
  for (let item of project) {
    const article = document.createElement('article');
    article.innerHTML = `
    <headingLevel>${item.title}</headingLevel>
    <img src="${item.image}" alt="${item.title}">
    <p>${item.description}</p>`;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}