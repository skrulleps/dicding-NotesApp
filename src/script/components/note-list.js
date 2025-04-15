// import {notesData} from "../data/local/notes-data.js"; 
import { NoteApi } from "../data/remote/note-api";

class NoteList extends HTMLElement {
  _notes = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.notes = this._notes;
  }

  static get observedAttributes() {
    return ['notes'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'notes') {
      this.notes = JSON.parse(newValue);
      this.render();
    }
  }

  async connectedCallback() {
    try {
      this.notes = await NoteApi.getNotes();
      this.render();
    } catch (error) {
      console.error('Failed to load notes:', error);
      this.notes = [];
      this.render();
    }
  }

  render() {
    if (this.notes.length === 0) {
      this.shadowRoot.innerHTML = `
        <style>
          p {
            text-align: center;
            color: var(--gray);
            padding: 2rem;
          }
        </style>
        <slot name="empty"></slot>
      `;
    } else {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: grid;
            grid-template-columns: inherit;
            gap: inherit;
          }
        </style>
        ${this.notes.map(note => `
          <note-item 
            note-id="${note.id}"
            note-title="${note.title.replace(/"/g, '"')}"
            note-body="${note.body.replace(/"/g, '"')}"
            created-at="${note.createdAt}"
          >
          </note-item>
        `).join('')}
      `;
    }
  }
}

customElements.define('note-list', NoteList);
