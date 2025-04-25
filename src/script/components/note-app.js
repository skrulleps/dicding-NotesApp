import { NoteApi } from "../data/remote/note-api.js";

export class NoteApp extends HTMLElement {
  constructor() {
    super();
    this.notes = [];
    this.isLoading = true;
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    this.render();
    this.toggleLoadingView(); // tampilkan loading dulu

    // Simulasikan delay loading 5 detik
    setTimeout(async () => {
      try {
        const notes = await NoteApi.getNotes();
        this.notes = Array.isArray(notes) ? notes : [];
      } catch (error) {
        console.error("Failed to load notes:", error);
        this.notes = [];
      }

      this.isLoading = false;
      this.toggleLoadingView();
      this.loadNotes();
    }, 500);
  }

  toggleLoadingView() {
    const loadingContainer =
      this.shadowRoot.querySelector("#loading-container");
    const contentContainer =
      this.shadowRoot.querySelector("#content-container");
    if (this.isLoading) {
      loadingContainer.classList.remove("hidden");
      contentContainer.classList.add("hidden");
    } else {
      loadingContainer.classList.add("hidden");
      contentContainer.classList.remove("hidden");
    }
  }

  render() {
    this.shadowRoot.innerHTML += `
      <style>
        .hidden {
          display: none;
        }
      </style>
      <slot name="header"></slot>
      <div id="loading-container">
        <slot name="loading"></slot>
      </div>
      <div id="content-container" class="hidden">
        <slot name="main"></slot>
        <slot name="show-archive"></slot>
      </div>
    `;
  }

  loadNotes() {
    const noteList = document.querySelector("note-list");
    const archiveList = document.querySelector("archive-list");

    if (noteList) {
      noteList.setAttribute("notes", JSON.stringify(this.notes));
    }

    if (archiveList) {
      const archivedNotes = this.notes.filter((note) => note.archived);
      archiveList.setAttribute("notes", JSON.stringify(archivedNotes));
    }
  }

  async addNote(note) {
    this.isLoading = true;
    this.toggleLoadingView();

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const addedNote = await NoteApi.addNote(note);
      if (addedNote) {
        this.notes.unshift(addedNote);
        this.loadNotes();
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      this.isLoading = false;
      this.toggleLoadingView();
    }
  }
}

customElements.define("note-app", NoteApp);
