import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const count = projectsContainer.querySelectorAll('article').length;
const title_name = document.querySelector('.projects-title');
title_name.textContent = `${count} Projects`

// d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

// let data = [1, 2];

// let total = 0;

// for (let d of data) {
//   total += d;
// }

// let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

// let data = [1, 2];
// let data = [1, 2, 3, 4, 5, 5];

// meaningless

// let data = [
//   { value: 1, label: 'apples' },
//   { value: 2, label: 'oranges' },
//   { value: 3, label: 'mangos' },
//   { value: 4, label: 'pears' },
//   { value: 5, label: 'limes' },
//   { value: 5, label: 'cherries' },
// ];


// let sliceGenerator = d3.pie();
// // let colors = ['gold', 'purple'];

// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill',colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
// })

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//   legend
//     .append('li')
//     .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// });

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
  );
  let sliceGenerator = d3.pie().value((d) => d.value);

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let arcData = sliceGenerator(data);

  let arcs = arcData.map((d) => arcGenerator(d));
  // arcs.forEach((arc) => {
  //   // TODO, fill in step for appending path to svg using D3
  //   d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');
  // });

  let legend = d3.select('.legend');
  //   data.forEach((d, idx) => {
  //       legend.append('li')
  //             .attr('style', `--color:${colors(idx)};`)
  //             .attr('class', 'legend-item')
  //             .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  // })


let query = '';

// let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener('change', (event) => {
//   // update query value
//   query = event.target.value;
//   // filter projects
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   // render filtered projects
//   renderProjects(filteredProjects, projectsContainer, 'h2');
// });


// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value(d => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map(d => arcGenerator(d));
  // TODO: clear up paths and legends
  d3.select('svg').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  // update paths and legends, refer to steps 1.4 and 2.2
  newArcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx));
  });

  let legend = d3.select('.legend');

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)};`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Call this function on page load
renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

let selectedIndex = -1;
let svg = d3.select('svg');
svg.selectAll('path').remove();
arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

    svg
      .selectAll('path')
      .attr('class', (_, idx) => (
        // TODO: filter idx to find correct pie slice and apply CSS from above
        idx === selectedIndex ? 'selected' : ''
      ));
    legend
    .selectAll('li')
    .attr('class', (_, idx) => (
      // TODO: filter idx to find correct legend and apply CSS from above
      idx === selectedIndex ? 'selected' : ''
    ));
  });
});

if (selectedIndex === -1) {
  renderProjects(projects, projectsContainer, 'h2');
} else {
  // TODO: filter projects and project them onto webpage
  // Hint: `.label` might be useful
  let selectedYear = data[selectedIndex].label;

  let filteredProjects = projects.filter((project) =>
    String(project.year) === String(selectedYear)
  );
  renderProjects(filteredProjects, projectsContainer, 'h2');
}
