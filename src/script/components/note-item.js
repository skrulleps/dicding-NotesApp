class NoteItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['note-id', 'note-title', 'note-body', 'created-at'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const title = this.getAttribute('note-title');
      const body = this.getAttribute('note-body');
      const createdAt = new Date(this.getAttribute('created-at')).toLocaleDateString();

      this.shadowRoot.innerHTML = `
        <style>
          h3 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: var(--primary);
          }
          p {
            margin-bottom: 1rem;
            color: var(--dark);
          }
          .date {
            font-size: 0.8rem;
            color: var(--gray);
          }
          .actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          button {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--gray);
          }
          button:hover {
            color: var(--primary);
          }
        </style>
        <h3>${title}</h3>
        <p>${body}</p>
        <div class="date">Created: ${createdAt}</div>
        <div class="actions">
          <button title="Archive"><i class="fas fa-archive"></i></button>
          <button title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      `;
    }
  }

  customElements.define('note-item', NoteItem);