// CONFIG

const origin = "https://www.thanku.social";
const thankuLogoUrl = `${origin}/thanku-logo-row.v0000001.svg`;

// HELPERS

function toCollectUrl({ id, lang }) {
  return `${origin}/${lang}/app/collect/${id}`;
}

function toCauseImageUrl(cause) {
  return `${origin}/donateeGroup/${cause}.v0000001.png`;
}

function toApiEndpointUrl({ simulate }) {
  return `${origin}/api/donate/postpaid${simulate ? "?simulate=true" : ""}`;
}

function htmlEscape(string) {
  return string
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function html(strings, ...args) {
  return strings
    .map((str, i) =>
      i < args.length
        ? str + (args[i].__html ? args[i].__html : htmlEscape(String(args[i])))
        : str
    )
    .join("");
}

// API CLIENT

const Api = {
  donatePostpaid({
    slug,
    donateeGroup,
    impactValue,
    message,
    language,
    pid,
    sig,
    simulate,
  }) {
    return fetch(toApiEndpointUrl({ simulate }), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-sig": sig },
      body: JSON.stringify({
        slug,
        donateeGroup,
        impactValue,
        message,
        language,
        pid,
      }),
    }).then(
      async (res) => {
        if (res.status >= 400) {
          throw Error("request invalid");
        }
        return res.json().catch(() => {
          throw Error("response data invalid");
        });
      },
      () => {
        throw Error("connection problems");
      }
    );
  },
};

// STYLES

const styles = html`
  <style>
    :host {
      --bg-image: linear-gradient(90deg, #eaf6f1, #d4edf7);
      --bg-color: #dff1f4;
      --bg-color-button: #01888b;
      --bg-color-button-hover: #00666b;
      --bg-color-impact: white;
      --bg-color-message: white;
      --color-text-base: #202c55;
      --color-text-headline: #01888b;
      --color-text-impact: #ec7614;
      --color-text-button: white;
      --color-text-message: #202c55;
      --shadow-color-message: rgba(95, 194, 197, 0.4);
      --font-family: "Exo", sans-serif;
      --font-size-base: 16px;
      --font-size-sm: 115%;
      --font-size-md: 125%;
      --font-size-lg: 135%;
    }
    .container {
      background-color: var(--bg-color);
      background-image: var(--bg-image);
      border-radius: 0.75em;
      color: var(--color-text-base);
      display: block;
      font-family: var(--font-family);
      font-size: var(--base-font-size);
      padding: 1.5em 1.5em 1.25em 1.5em;
      text-decoration: none;
      line-height: 1.5;
    }
    @media (min-width: 640px) {
      .container {
        font-size: var(--font-size-sm);
      }
    }
    @media (min-width: 768px) {
      .container {
        font-size: var(--font-size-md);
      }
    }
    @media (min-width: 1024px) {
      .container {
        font-size: var(--font-size-lg);
      }
    }
    .headline {
      color: var(--color-text-headline);
      font-size: 1.25em;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    .message {
      align-items: center;
      background-color: var(--bg-color-message);
      border-radius: 0.75em;
      box-shadow: 0 0 0.75em 0 var(--shadow-color-message);
      color: var(--color-text-message);
      display: flex;
      margin: 1em auto 0 auto;
      max-width: 32em;
      padding: 0.75em 1.25em;
      position: relative;
    }
    .btn {
      background-color: var(--bg-color-button);
      border-radius: 9999px;
      color: var(--color-text-button);
      display: inline-block;
      font-size: 1em;
      font-weight: 600;
      padding: 0.75em 2.5em;
      text-align: center;
      text-decoration: none;
      transition-duration: 0.3s;
      transition-property: background-color;
    }
    .btn:hover {
      background-color: var(--bg-color-button-hover);
    }
    .donation {
      display: flex;
      justify-content: center;
      margin: 1.5em 0 0 0;
      padding: 0;
    }
    .impact {
      align-items: center;
      background-color: var(--bg-color-impact);
      border-radius: 9999px;
      box-sizing: border-box;
      color: var(--color-text-impact);
      display: inline-flex;
      flex-direction: column;
      height: 6em;
      justify-content: center;
      line-height: 1;
      padding: 0.5em;
      text-align: center;
      width: 6em;
    }
    .impact-value {
      font-size: 2.25em;
    }
    .impact-name {
      font-size: 0.875em;
      line-height: 1.25;
      margin-bottom: -0.25em;
    }
    .impact-info {
      margin: 1em 0 0 0;
      padding: 0;
      text-align: center;
    }
    .cause {
      height: 6em;
      margin-left: 1em;
      width: 6em;
    }
    .action,
    .powered-by {
      padding: 0;
      text-align: center;
      margin: 1.5em 0 0 0;
    }
    .powered-by-text {
      font-size: 0.85em;
    }
    .logo {
      background-color: white;
      border-radius: 0.25rem;
      display: inline-block;
      height: 1em;
      margin-left: 0.25rem;
      padding: 0.35em 0.5rem 0.25rem 0.5rem;
      vertical-align: middle;
      width: 5em;
    }
    .link {
      color: inherit;
      text-decoration: underline;
    }
  </style>
`;

// TRANSLATIONS

const translations = {
  de: {
    headlne: "Ein ThankU für Dich",
    impactUnit: {
      CleanOcean: () => "kg",
      PlantTrees: ({ value }) => (value === 1 ? "Baum" : "Bäume"),
      ProtectWildlife: () => "m²",
    },
    impactInfo: {
      CleanOcean: ({ value }) =>
        `Dieses ThankU entfernt ${value} kg Plastik aus dem Ozean.`,
      PlantTrees: ({ value }) =>
        `Dieses ThankU pflanzt ${
          value === 1 ? "einen neuen Baum" : `${value} neue Bäume`
        }.`,
      ProtectWildlife: ({ value }) =>
        `Dieses ThankU schützt ${value} m² Wildtierlebensraum.`,
    },
    collectLinkTitle: "ThankU jetzt einsammeln",
    thankuLinkTitle: "ThankU besuchen",
  },
  en: {
    headlne: "A ThankU for you",
    impactUnit: {
      CleanOcean: () => "kg",
      PlantTrees: ({ value }) => (value === 1 ? "tree" : "trees"),
      ProtectWildlife: () => "m²",
    },
    impactInfo: {
      CleanOcean: ({ value }) =>
        `This ThankU removes ${value} kg ocean plastic.`,
      PlantTrees: ({ value }) =>
        `This ThankU plants ${
          value === 1 ? "one new tree" : `${value} new trees`
        }.`,
      ProtectWildlife: ({ value }) =>
        `This ThankU protects ${value} m² wildlife habitat.`,
    },
    collectLinkTitle: "Collect ThankU now",
    thankuLinkTitle: "Visit ThankU",
  },
};

// RENDER HELPER

const renderData = ({ t, lang, id, cause, impact, message }) => html`
  ${{ __html: styles }}
  <div class="container">
    <h2 class="headline">${t.headlne}</h2>
    <p class="message">${message}</p>
    <p class="donation">
      <span class="impact">
        <span class="impact-value">${impact}</span>
        <span class="impact-name">
          ${t.impactUnit[cause]({ value: impact })}
        </span>
      </span>
      <img
        src="${toCauseImageUrl(cause)}"
        alt="${cause}"
        width="100"
        height="100"
        class="cause"
      />
    </p>
    <p class="impact-info">${t.impactInfo[cause]({ value: impact })}</p>
    <p class="action">
      <a href="${toCollectUrl({ id, lang })}" class="btn">
        ${t.collectLinkTitle}
      </a>
    </p>
    <p class="powered-by">
      <span class="powered-by-text">powered by</span>
      <a href="${origin}" class="link" title="${t.thankuLinkTitle}">
        <img
          src="${thankuLogoUrl}"
          width="100"
          height="20"
          alt="ThankU"
          class="logo"
        />
      </a>
    </p>
  </div>
`;

// WEB COMPONENT

class ThankUPostpaidWidget extends HTMLElement {
  constructor() {
    super();

    const lang = this.getAttribute("lang") || "en";
    const slug = this.getAttribute("slug");
    const cause = this.getAttribute("cause");
    const impact = parseInt(this.getAttribute("impact"));
    const pid = this.getAttribute("pid");
    const sig = this.getAttribute("sig");
    const message = this.getAttribute("message");
    const simulate = this.getAttribute("simulate") === "";

    Api.donatePostpaid({
      language: lang,
      slug,
      donateeGroup: cause,
      impactValue: impact,
      pid,
      sig,
      message,
      simulate,
    })
      .then(({ id }) => {
        const t = translations[lang] || translations.en;
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = renderData({ id, cause, impact, message, t, lang });
      })
      .catch(() => {
        // ignore error and continue to show the fallback markup to the user
      });
  }
}

customElements.define("thanku-postpaid-widget", ThankUPostpaidWidget);

export { ThankUPostpaidWidget };
