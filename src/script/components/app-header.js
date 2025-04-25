export class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          h1 {
            font-size: 1.8rem;
            margin: 0;
          }
        </style>
        <slot></slot>
      `;
  }
}

customElements.define("app-header", AppHeader);
