
const BASE_URL = 'https://notes-api.dicoding.dev/v2';

export class NoteApi {
  static showResponseMessage(message = 'Check your internet connection') {
    alert(message);
  }

  static async getNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();

      if (responseJson.error) {
        NoteApi.showResponseMessage(responseJson.message);
      } else {
        return responseJson.data;
      }
    } catch (error) {
      NoteApi.showResponseMessage(error.message);
    }
  }

  static async addNote({ title, body }) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body })
      });
  
      const responseJson = await response.json();
  
      if (responseJson.error) {
        NoteApi.showResponseMessage(responseJson.message);
      } else {
        return responseJson.data; // Note yang berhasil dibuat
      }
    } catch (error) {
      NoteApi.showResponseMessage(error.message);
    }
  }

  // Mengambil semua note yang diarsipkan
  static async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      const responseJson = await response.json();

      if (responseJson.error) {
        NoteApi.showResponseMessage(responseJson.message);
      } else {
        return responseJson.data; // Array dari archived notes
      }
    } catch (error) {
      NoteApi.showResponseMessage(error.message);
    }
  }

  // Mengambil satu note berdasarkan ID
  static async getNoteById(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`);
      const responseJson = await response.json();

      if (responseJson.error) {
        NoteApi.showResponseMessage(responseJson.message);
      } else {
        return responseJson.data; // Detail note
      }
    } catch (error) {
      NoteApi.showResponseMessage(error.message);
    }
  }

  // Mengarsipkan note
  static async archiveNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
        method: 'POST',
      });
      const responseJson = await response.json();

      if (responseJson.error) {
        NoteApi.showResponseMessage(responseJson.message);
      } else {
        return responseJson.message; // "Note archived"
      }
    } catch (error) {
      NoteApi.showResponseMessage(error.message);
    }
 } 

 static async unarchiveNote(noteId) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
      method: 'POST'
    });
    const responseJson = await response.json();

    if (responseJson.error) {
      NoteApi.showResponseMessage(responseJson.message);
    } else {
      return responseJson.message; // "Note unarchived"
    }

    } catch (error) {
      NoteApi.showResponseMessage(error.message);
    }
  }
 

  // Menghapus note
  static async deleteNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });
      const responseJson = await response.json();

      if (responseJson.error) {
        NoteApi.showResponseMessage(responseJson.message);
      } else {
        return responseJson.message; // "Note deleted"
      }
    } catch (error) {
      NoteApi.showResponseMessage(error.message);
    }
  }
}
