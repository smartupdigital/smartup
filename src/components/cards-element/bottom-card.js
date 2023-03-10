import { LitElement, html, css } from 'lit-element';

import { SharedStyles } from '../shared-styles.js';

class BottomCard extends LitElement {
  /* eslint-disable require-jsdoc */
  static get styles() {
    return [
      SharedStyles,
      css`
        :host{
          display: block;
        }

        section {
          position: relative;
          height: 296px;
          display: flex;
          align-items: center;
          padding: 0px;
          background: black;
          overflow: hidden;
          font-size: var(--app-title-font-size-mobile, 18px);
        }

        .default-opacity {
          position: absolute;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          opacity: 1;
          transition: opacity 1s;
        }

        .opacity-decreased {
          opacity: 0.5;
        }

        .default-text {
          width: 100%;
          z-index: 1;
          color: white;
          text-align: center;
          transition: all 1s ease-out;
          margin: 80% 0 0;
          padding: 50px;
        }

        .center-text {
          margin: 0;
        }

        @media (min-width: 768px) {
          section {
            height: 100%;
          }

          p {
            font-size: var(--app-paragraph-font-size-mobile, 16px);
          }
        }

        @media (min-width: 1100px) {
          p {
            font-size: var(--app-subtitle-font-size, 24px);
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      decreasedOpacity: { type: Boolean },
      centeredText: { type: Boolean },
      text: { type: String },
      backgroundImage: { type: String },
    };
  }

  constructor() {
    super();
    this.decreasedOpacity = false;
    this.centeredText = false;
    this.text = '';
    this.backgroundImage = '';
  }

  render() {
    return html`
        <section tabindex="0">
          <p class="default-text ${this.centeredText ? 'center-text' : ''}"><lit-i18n>${this.text}</lit-i18n></p>
          <div class="default-opacity ${this.decreasedOpacity ? 'opacity-decreased' : ''}" style="background-image: ${this.backgroundImage}"></div>
        </section>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if (window.IntersectionObserver) {
      this.dispatchEvent(new CustomEvent('start-observing-intersection', {
        bubbles: true,
        composed: true,
        detail: { element: this, threshold: 0.6, callback: this._handleIntersection.bind(this) },
      }));
    } else {
      this.decreasedOpacity = true;
      this.centeredText = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (window.IntersectionObserver) {
      this.dispatchEvent(new CustomEvent('stop-observing-intersection', {
        bubbles: true,
        composed: true,
        detail: { element: this },
      }));
    }
  }

  /* eslint-enable require-jsdoc */

  /**
   * Handles IntersectionObserver intersecting callback
   * @param {IntersectionObserverEntry[]} event IntersectionObserverEntry array
   */
  _handleIntersection([{ isIntersecting }]) {
    this.decreasedOpacity = isIntersecting;
    this.centeredText = isIntersecting;

    if (isIntersecting) {
      this.dispatchEvent(new CustomEvent('stop-observing-intersection', {
        bubbles: true,
        composed: true,
        detail: { element: this, threshold: 0.6 },
      }));
    }
  }
}

customElements.define('bottom-card', BottomCard);
