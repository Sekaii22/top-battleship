import "./styles.css";
import { createStartPage } from "./page-ui";

const content = document.querySelector(".content");

const startPage = createStartPage(); 

content.appendChild(startPage);


