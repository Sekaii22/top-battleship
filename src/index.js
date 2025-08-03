import "./styles.css";
import { createStartPage, createShipPlacementPage } from "./page-ui";

const content = document.querySelector(".content");

const shipPlacementContainer = createShipPlacementPage(); 
const startPage = createStartPage(); 

content.appendChild(shipPlacementContainer);


