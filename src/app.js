import "./script/components/index.js";
import "./styles/style.css";
import "./styles/note-styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "regenerator-runtime";
import home from "./script/views/home.js";

document.addEventListener("DOMContentLoaded", () => {
  home();
});
