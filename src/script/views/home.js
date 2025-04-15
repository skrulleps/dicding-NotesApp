import Utils from '../utils.js';
import { NoteApi } from '../data/remote/note-api.js';

const home = () => {
  setTimeout(() => {
    const noteAppElement = document.querySelector('note-app');
    if (!noteAppElement) {
      console.error('Note app element not found');
      return;
    }

    const noteListElement = noteAppElement.querySelector('note-list');
    const noteFormElement = noteAppElement.querySelector('note-form');
    const archiveListElement = noteAppElement.querySelector('archive-list');
    const showArchiveButton = noteFormElement.querySelector('#archive-button')
    
    

    
    if (!noteListElement || !noteFormElement) {
      console.error('Required components not found');
      return;
    }

    const addNewNote = async (newNote) => {
      try {
        showLoading();
        const addedNote = await NoteApi.addNote({
          title: newNote.title,
          body: newNote.body
        });
        
        if (!addedNote) {
          throw new Error('Failed to add note - no data returned');
        }
        
        const notes = await NoteApi.getNotes();
        displayResult(notes);
        alert('Catatan berhasil ditambahkan!');
      } catch (error) {
        console.error('Gagal menambahkan catatan:', error);
        alert('Gagal menambahkan catatan: ' + error.message);
        showQueryWaiting();
      }
    };

    const showNotes = async () => {
      try {
        showLoading();
        const notes = await NoteApi.getNotes();
        const archivedNotes = await NoteApi.getArchivedNotes();
        displayResult(notes);
        // displayResult(archivedNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
        alert('Failed to load notes');
        showQueryWaiting();
      }
    };

    const showArchivedNotes = async () => {
      try {
        const archivedNotes = await NoteApi.getArchivedNotes();
        archiveListElement.setAttribute('notes', JSON.stringify(archivedNotes));
      } catch (error) {
        console.error('Failed to load archived notes:', error);
      }
    };

    const displayResult = (notes) => {
      noteListElement.setAttribute('notes', JSON.stringify(notes));
    };

    const showLoading = () => {
      noteListElement.setAttribute('notes', JSON.stringify([]));
    };

    const showQueryWaiting = () => {
      noteListElement.setAttribute('notes', JSON.stringify([]));
    };

    // Event listeners
    noteFormElement.addEventListener('add-note', (event) => {
      addNewNote(event.detail);
    });

    noteListElement.addEventListener('archive-note', async (e) => {
      try {
        await NoteApi.archiveNote(e.detail.noteId); 
        await showNotes();       
        await showArchivedNotes(); 
        console.log('Notes after archiving:', noteListElement.getAttribute('notes'));
        alert('Note archived successfully');
      } catch (error) {
        console.error('Failed to archive note:', error);
        alert('Failed to archive note: ' + error.message);
      }
    });

    showArchiveButton.addEventListener('click', async (e) => {
      const archiveListElement = noteAppElement.querySelector('archive-list');
      if (archiveListElement) {
        if (archiveListElement.hasAttribute('hidden')) {
          archiveListElement.removeAttribute('hidden');
          showArchiveButton.textContent = 'Hide Archive'
        } else {
          archiveListElement.setAttribute('hidden', '');
          showArchiveButton.textContent = 'Show Archive'
        }
      }
    });
    

    archiveListElement.addEventListener('unarchive-note', async (e) => {
      try {
        await NoteApi.unarchiveNote(e.detail.noteId);
        await showNotes();
        await showArchivedNotes();
        alert('Note unarchived successfully');
      } catch (error) {
        console.error('Failed to unarchive note:', error);
        alert('Failed to unarchive note: ' + error.message);
      }
    });


    // Initialize
    showQueryWaiting();
    showNotes();
    showArchivedNotes();
  });
};

export default home;