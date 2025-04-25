import { NoteApi } from "../data/remote/note-api.js";

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["note-id", "note-title", "note-body", "created-at"];
  }

  async loadNotes() {
    try {
      console.log("Fetching notes from API...");
      const notes = await NoteApi.getNotes();
      // console.log('Notes received:', notes);

      if (Array.isArray(notes)) {
        this.notes = notes;
      } else {
        throw new Error("Invalid notes data format");
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      this.notes = [];
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    // this.loadNotes();
  }

  _addEventListeners() {
    const archiveBtn = this.shadowRoot.querySelector("#archive");
    const deleteBtn = this.shadowRoot.querySelector("#delete");

    if (archiveBtn) {
      archiveBtn.addEventListener("click", async () => {
        const noteId = this.getAttribute("note-id");
        try {
          const result = await NoteApi.archiveNote(noteId);
          if (result) {
            this.dispatchEvent(
              new CustomEvent("archive-note", {
                bubbles: true,
                composed: true,
                detail: { noteId: this.getAttribute("note-id") },
              }),
            );
            alert("Note archived");
            this.loadNotes();
            this.remove();
          } else {
            alert("Failed to archive note");
          }
        } catch (err) {
          console.error("Archive error:", err);
          alert("Failed to archive note: " + err.message);
        }
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", async () => {
        const noteId = this.getAttribute("note-id");
        try {
          const result = await NoteApi.deleteNote(noteId);
          if (result) {
            this.dispatchEvent(
              new CustomEvent("delete-note", {
                detail: { noteId },
                bubbles: true,
                composed: true,
              }),
            );
            alert("Note deleted");
            this.remove();
          } else {
            alert("Failed to delete note");
          }
        } catch (err) {
          console.error("Delete error:", err);
          alert("Failed to delete note: " + err.message);
        }
      });
    }
  }

  render() {
    const noteId = this.getAttribute("note-id");
    const title = this.getAttribute("note-title");
    const body = this.getAttribute("note-body");
    const createdAt = new Date(
      this.getAttribute("created-at"),
    ).toLocaleDateString();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #fff;
          margin-bottom: 1rem;
        }

        h3 {
          font-size: 1.2rem;
          margin: 0 0 0.5rem;
          color: #333;
        }

        p {
          margin: 0 0 1rem;
          color: #555;
        }

        .date {
          font-size: 0.85rem;
          color: #888;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .note-action {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        #archive {
          background: #6c757d;
          color: #fff;
        }

        #edit {
          background: #007bff;
          color: #fff;
        }

        #share {
          background: #28a745;
          color: #fff;
        }

        #delete {
          background: #dc3545;
          color: #fff;
        }

        .note-action:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }

        .note-action:active {
          transform: scale(0.96);
        }
      </style>

      <h3>${title}</h3>
      <p>${body}</p>
      <div class="date">Created: ${createdAt}</div>
      <div class="actions">
        <button class="note-action" id="archive">Archive</button>
        <button class="note-action" id="delete">Delete</button>
      </div>
    `;

    this._addEventListeners();
  }
}

customElements.define("note-item", NoteItem);
