import {notesData} from "../data/notes-data.js"; 

class NoteList extends HTMLElement {
  _notes = [...notesData]

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

    connectedCallback() {
      this.notes = notesData; // Set the notes to the existing notesData


      this.render();

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
          ></note-item>
        `).join('')}
      `;
    }
  }
}

customElements.define('note-list', NoteList);
