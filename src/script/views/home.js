import Utils from '../utils.js';
import NotesData from '../data/notes-data.js';

const home = () => {
  const searchFormElement = document.querySelector('.search-bar');
  const noteListContainerElement = document.querySelector('#note-form');
  const noteQueryWaitingElement = document.querySelector('query-waiting');
  const noteLoadingElement = document.querySelector('search-loading');
  const noteListElement = noteListContainerElement.querySelector('note-list');

  const addNewNote = (newNote) => {
      NotesData.addNote(newNote); // Add the new note to the data
      displayResult(NotesData.notesData); // Update the displayed notes
  };

  const showNotes = (query) => {

    showLoading();

    const result = NotesData.searchNotes(query);
    displayResult(result);

    showNoteList();
  };

  const onSearchHandler = (event) => {
    event.preventDefault();

    const { query } = event.detail;
    showNotes(query);
  };

  const displayResult = (notes) => {
    const noteItemElements = notes.map((note) => {
      const noteItemElement = document.createElement('note-item');
      noteItemElement.note = note;

      return noteItemElement;
    });

    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  const showQueryWaiting = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteQueryWaitingElement);
  };

searchFormElement.addEventListener('search', onSearchHandler);
const noteFormElement = document.querySelector('note-form');
noteFormElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = noteFormElement.querySelector('#title').value;
    const body = noteFormElement.querySelector('#body').value;

    if (title && body) {
        const newNote = {
            id: `notes-${Math.random().toString(36).substr(2, 9)}`,
            title,
            body,
            createdAt: new Date().toISOString(),
            archived: false
        };
        addNewNote(newNote); // Call the function to add the new note
        noteFormElement.reset(); // Reset the form
    } else {
        alert('Please fill in both title and content');
    }
});

  showQueryWaiting();
};

export default home;
