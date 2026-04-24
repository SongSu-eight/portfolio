import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const count = projectsContainer.querySelectorAll('article').length;
const title_name = document.querySelector('.projects-title');
title_name.textContent = `${count} Projects`
