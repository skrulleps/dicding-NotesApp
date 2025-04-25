import { NoteApi } from "../data/remote/note-api.js";

const home = () => {
  const noteAppElement = document.querySelector("note-app");
  if (!noteAppElement) {
    console.error("Note app element not found");
    return;
  }

  const noteListElement = noteAppElement.querySelector("note-list");
  const noteFormElement = noteAppElement.querySelector("note-form");
  const archiveListElement = noteAppElement.querySelector("archive-list");
  const showArchiveButton = noteFormElement.querySelector("#archive-button");
  const LoadingElement = noteAppElement.querySelector("note-loading");

  if (
    !noteListElement ||
    !noteFormElement ||
    !archiveListElement ||
    !LoadingElement
  ) {
    console.error("Required components not found");
    return;
  }

  const showQueryWaiting = () => {
    noteListElement.setAttribute("notes", JSON.stringify([]));
  };

  const displayResult = (notes) => {
    noteListElement.setAttribute("notes", JSON.stringify(notes));
  };

  // Menampilkan catatan aktif
  async function showNotes() {
    const notes = await NoteApi.getNotes();
    const activeNotes = notes.filter((note) => !note.archived); // ambil yang belum diarsipkan

    const container = document.querySelector("#note-list");
    container.innerHTML = ""; // clear list

    activeNotes.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("note-id", note.id);
      noteElement.setAttribute("note-title", note.title);
      noteElement.setAttribute("note-body", note.body);
      noteElement.setAttribute("created-at", note.createdAt);
      container.appendChild(noteElement);
    });
  }

  // Menampilkan catatan yang sudah diarsipkan
  async function showArchivedNotes() {
    const notes = await NoteApi.getNotes();
    const archivedNotes = notes.filter((note) => note.archived); // ambil yang sudah diarsipkan

    const container = document.querySelector("#archived-note-list");
    container.innerHTML = ""; // clear list

    archivedNotes.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("note-id", note.id);
      noteElement.setAttribute("note-title", note.title);
      noteElement.setAttribute("note-body", note.body);
      noteElement.setAttribute("created-at", note.createdAt);
      container.appendChild(noteElement);
    });
  }

  // Load semua catatan (aktif dan arsip)
  const loadAll = async () => {
    console.log("[loadAll] Loading started");

    try {
      await Promise.all([showNotes(), showArchivedNotes()]);
      console.log("[loadAll] Notes loaded", showNotes);
      console.log("[loadAll] archive Notes loaded", showArchiveButton);
    } catch (error) {
      console.error(error);
      showQueryWaiting();
    } finally {
      console.log("[loadAll] Loading ended");
    }
  };

  // Menambahkan catatan baru
  const addNewNote = async (newNote) => {
    try {
      event.preventDefault();
      const addedNote = await NoteApi.addNote({
        title: newNote.title,
        body: newNote.body,
      });

      if (!addedNote) {
        throw new Error("Failed to add note - no data returned");
      }

      await loadAll(); // Memuat semua catatan setelah penambahan
      alert("Catatan berhasil ditambahkan!");
      window.location.reload();
    } catch (error) {
      console.error("Gagal menambahkan catatan:", error);
      alert("Gagal menambahkan catatan: " + error.message);
      showQueryWaiting();
    }
  };

  // Event listeners untuk menangani aksi dari form dan list
  noteFormElement.addEventListener("add-note", (event) => {
    addNewNote(event.detail);
  });

  // Event listener untuk mengarsipkan catatan
  noteListElement.addEventListener("archive-note", async (e) => {
    try {
      await NoteApi.archiveNote(e.detail.noteId);
      console.log(`[archive-note] Note with ID ${e.detail.noteId} archived`);

      await loadAll(); // Memuat ulang setelah arsip
      alert("Note archived successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to archive note:", error);
      alert("Failed to archive note: " + error.message);
    }
  });

  // Event listener untuk meng-unarchive catatan
  archiveListElement.addEventListener("unarchive-note", async (e) => {
    try {
      await NoteApi.unarchiveNote(e.detail.noteId);
      await loadAll(); // Memuat ulang setelah unarchive
      window.location.reload();
    } catch (error) {
      console.error("Failed to unarchive note:", error);
      alert("Failed to unarchive note: " + error.message);
    }
  });

  // Toggle tampilan arsip
  showArchiveButton.addEventListener("click", () => {
    if (archiveListElement.hasAttribute("hidden")) {
      archiveListElement.removeAttribute("hidden");
      showArchiveButton.textContent = "Hide Archive";
    } else {
      archiveListElement.setAttribute("hidden", "");
      showArchiveButton.textContent = "Show Archive";
    }
  });

  // Initialize loading semua catatan
  showNotes();
  loadAll();
};

export default home;
