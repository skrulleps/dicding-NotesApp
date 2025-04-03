import { notesData } from "../data/notes-data.js";

export class NoteApp extends HTMLElement {

    _notes=[...notesData]
    constructor() {
      super();
      this.notes = this._notes;
    }

    connectedCallback() {
      this.attachShadow({ mode: 'open' });
      this.notes = notesData;
      this.render();
      this.loadNotes();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <slot name="header"></slot>
        <slot name="main"></slot>
      `;
    }

    loadNotes() {
      const noteList = document.querySelector('note-list');
      noteList.setAttribute('notes', JSON.stringify(this.notes));
    }

    addNote(note) {
      this.notes.unshift(note);
      this.loadNotes();
    }
  }

  customElements.define('note-app', NoteApp);
