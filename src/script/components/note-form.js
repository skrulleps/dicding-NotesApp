// import { addNote } from '../data/local/notes-data.js';
import { NoteApi } from "../data/remote/note-api.js";

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupForm();
  }

  render() {
    this.shadowRoot.innerHTML += `
            <style>
                :host {
                    display: block;
                    margin-bottom: 2rem;
                }
                .error {
                    color: red;
                    font-size: 0.9em;
                }
            </style>
            <form>
                <slot name="title"></slot>
                <div class="error" id="title-error" style="display: none;">Masukan minimal 1 karakter</div>
                <slot name="body"></slot>
                <div class="error" id="body-error" style="display: none;">Masukan minimal 2 karakter</div>
                <slot name="actions"></slot>
            </form>
        `;
  }

  setupForm() {
    const form = this.shadowRoot.querySelector("form");
    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");
    const submitButton = this.querySelector('button[type="submit"]');
    const resetButton = this.querySelector('button[type="reset"]');
    const titleError = this.shadowRoot.querySelector("#title-error");
    const bodyError = this.shadowRoot.querySelector("#body-error");

    const validateTitle = () => {
      if (titleInput.value.length < 3) {
        titleError.style.display = "block"; // Show error message
      } else {
        titleError.style.display = "none"; // Hide error message
      }
    };

    const validateBody = () => {
      if (bodyInput.value.length < 3) {
        bodyError.style.display = "block"; // Show error message
      } else {
        bodyError.style.display = "none"; // Hide error message
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent default form submission

      const title = titleInput.value;
      const body = bodyInput.value;

      // Final validation before submission
      if (title.length < 1) {
        titleError.style.display = "block";
        return; // Stop submission if title is invalid
      }
      if (body.length < 2) {
        bodyError.style.display = "block";
        return; // Stop submission if body is invalid
      }

      const newNote = {
        id: `notes-${Math.random().toString(36).substr(2, 9)}`,
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
      };

      this.dispatchEvent(
        new CustomEvent("add-note", {
          detail: newNote,
          bubbles: true,
          composed: true,
        }),
      );

      form.reset(); // Reset the form fields
      titleError.style.display = "none"; // Hide error message
      bodyError.style.display = "none"; // Hide error message
    };

    // Add the event listener for the submit button
    submitButton.addEventListener("click", handleSubmit);

    // Add the event listener for the reset button
    resetButton.addEventListener("click", () => {
      titleInput.value = ""; // Clear the title input
      bodyInput.value = ""; // Clear the body input
      titleError.style.display = "none"; // Hide error message
      bodyError.style.display = "none"; // Hide error message
    });

    // Real-time validation
    titleInput.addEventListener("input", validateTitle);
    bodyInput.addEventListener("input", validateBody);
  }
}

customElements.define("note-form", NoteForm);
