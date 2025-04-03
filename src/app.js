// import { NoteApp } from './script/components/note-app.js';
// import { NoteForm } from './script/components/note-form.js';
// import { NoteList } from './script/components/note-list.js';
// import { NoteItem } from './script/components/note-item.js';
// import { AppHeader } from './script/components/app-header.js';
import { notesData, addNote } from './script/data/notes-data.js';
import './script/components/index.js';

// Register all components
// customElements.define('note-app', NoteApp);
// customElements.define('note-form', NoteForm);
// customElements.define('note-list', NoteList);
// customElements.define('note-item', NoteItem);
// customElements.define('app-header', AppHeader);

// Initialize notes data
document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.querySelector('note-form');
    const noteList = document.querySelector('note-list');

    noteForm.addEventListener('add-note', (event) => {
        const newNote = event.detail;
        addNote(newNote); // Ensure addNote is called to update the data
        noteList.setAttribute('notes', JSON.stringify(notesData)); // Update the note list
    });
});