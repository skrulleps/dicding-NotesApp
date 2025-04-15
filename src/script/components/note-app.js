import { NoteApi } from "../data/remote/note-api.js";

export class NoteApp extends HTMLElement {
    constructor() {
      super();
      this.notes = [];
    }

    async connectedCallback() {
      this.attachShadow({ mode: 'open' });
      this.render();
      
      try {
        console.log('Fetching notes from API...');
        const notes = await NoteApi.getNotes();
        console.log('Notes received:', notes);
        
        if (Array.isArray(notes)) {
          this.notes = notes;
          this.loadNotes();
        } else {
          throw new Error('Invalid notes data format');
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
        this.notes = [];
        this.loadNotes(); // Tetap load dengan array kosong
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
        <slot name="header"></slot>
        <slot name="main"></slot>
        <slot name="show-archive"></slot>
      `;
    }

    loadNotes() {
      const noteList = document.querySelector('note-list');
      const archiveList = document.querySelector('archive-list');

      if (noteList) {
        noteList.setAttribute('notes', JSON.stringify(this.notes));
      }

      if (archiveList) {
        const archivedNotes = this.notes.filter(note => note.archived);
        archiveList.setAttribute('notes', JSON.stringify(archivedNotes));
        archiveList.removeAttribute('hidden'); // pastikan tidak tersembunyi
      }
    }

    async addNote(note) {
      try {
        const addedNote = await NoteApi.addNote(note);
        if (addedNote) {
          this.notes.unshift(addedNote);
          this.loadNotes();
        }
      } catch (error) {
        console.error('Failed to add note:', error);
      }
    }
}

customElements.define('note-app', NoteApp);
