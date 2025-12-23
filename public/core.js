const btnUser = document.getElementById("btnUser");

const userCard = document.getElementById("userCard");
const countryCard = document.getElementById("countryCard");
const ratesCard = document.getElementById("ratesCard");
const newsCard = document.getElementById("newsCard");

function setLoading(isLoading) {
    btnUser.disabled = isLoading;
    btnUser.textContent = isLoading ? "Loading..." : "Get Random User";
}

function safeText(v) {
    if (v === null || v === undefined || v === "") return "N/A";
    return String(v);
}

function formatDate(iso) {
    if (!iso || iso === "N/A") return "N/A";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "2-digit" });
}

function renderUser(u) {
    userCard.innerHTML = `
    <h2>Random User</h2>
    <div class="row">
      <img class="avatar" src="${u.picture || ""}" alt="Profile picture" />
      <div class="kv">
        <p class="title">${safeText(u.firstName)} ${safeText(u.lastName)}</p>
        <p class="meta">${safeText(u.gender)} • Age: ${safeText(u.age)}</p>
        <p class="meta">DOB: ${formatDate(u.dob)}</p>
        <p class="meta">${safeText(u.city)}, ${safeText(u.country)}</p>
      </div>
    </div>

    <div class="table">
      <div class="label">First name</div><div class="value">${safeText(u.firstName)}</div>
      <div class="label">Last name</div><div class="value">${safeText(u.lastName)}</div>
      <div class="label">Gender</div><div class="value">${safeText(u.gender)}</div>
      <div class="label">Age</div><div class="value">${safeText(u.age)}</div>
      <div class="label">Date of birth</div><div class="value">${formatDate(u.dob)}</div>
      <div class="label">City</div><div class="value">${safeText(u.city)}</div>
      <div class="label">Country</div><div class="value">${safeText(u.country)}</div>
      <div class="label">Full address</div><div class="value">${safeText(u.fullAddress)}</div>
    </div>
  `;
}

function renderCountry(c) {
    countryCard.innerHTML = `
    <h2>Country</h2>
    <div class="row">
      <img class="avatar" src="${c.flag || ""}" alt="Flag" />
      <div class="kv">
        <p class="title">${safeText(c.countryName)}</p>
        <p class="meta">Capital: ${safeText(c.capital)}</p>
        <p class="meta">Languages: ${safeText(c.languages)}</p>
        <p class="meta">Currency: ${safeText(c.currencyCode)} (${safeText(c.currencyName)})</p>
      </div>
    </div>

    <div class="table">
      <div class="label">Country name</div><div class="value">${safeText(c.countryName)}</div>
      <div class="label">Capital</div><div class="value">${safeText(c.capital)}</div>
      <div class="label">Official language(s)</div><div class="value">${safeText(c.languages)}</div>
      <div class="label">Currency</div><div class="value">${safeText(c.currencyCode)} (${safeText(c.currencyName)})</div>
    </div>
  `;
}

function renderRates(r) {
    const usd = typeof r.USD === "number" ? r.USD.toFixed(4) : "N/A";
    const kzt = typeof r.KZT === "number" ? r.KZT.toFixed(4) : "N/A";

    ratesCard.innerHTML = `
    <h2>Exchange Rate</h2>
    <div class="split">
      <div class="stat">
        <p class="label2">Base</p>
        <p class="value2">1 ${safeText(r.base)}</p>
      </div>
      <div class="stat">
        <p class="label2">USD</p>
        <p class="value2">${usd}</p>
      </div>
      <div class="stat">
        <p class="label2">KZT</p>
        <p class="value2">${kzt}</p>
      </div>
      <div class="stat">
        <p class="label2">Example</p>
        <p class="value2">1 ${safeText(r.base)} = ${usd} USD</p>
      </div>
    </div>
    <div class="table" style="margin-top:10px;">
      <div class="label">Example</div>
      <div class="value">1 ${safeText(r.base)} = ${usd} USD, 1 ${safeText(r.base)} = ${kzt} KZT</div>
    </div>
  `;
}

function renderNews(countryName, articles) {
    const list = (articles || []).map(a => {
        const img = a.image ? `<img class="news-img" src="${a.image}" alt="news image" />` : `<div class="news-img"></div>`;
        return `
      <div class="news-item">
        ${img}
        <div>
          <p class="news-title">${safeText(a.title)}</p>
          <p class="news-desc">${safeText(a.description)}</p>
          <a class="news-link" href="${a.url}" target="_blank" rel="noreferrer">Open article • ${safeText(a.source)}</a>
        </div>
      </div>
    `;
    }).join("");

    newsCard.innerHTML = `
    <h2>News Headlines</h2>
    <div class="table">
      <div class="label">Filter rule</div>
      <div class="value">Title contains: "${safeText(countryName)}" (EN only)</div>
    </div>
    <div class="news-list">
      ${list || `<div class="placeholder">No headlines matched the rule.</div>`}
    </div>
  `;
}

function renderError(where, message) {
    const html = `<div class="error"><b>${safeText(where)}:</b> ${safeText(message)}</div>`;
    if (where === "User") userCard.innerHTML = `<h2>Random User</h2>${html}`;
    else if (where === "Country") countryCard.innerHTML = `<h2>Country</h2>${html}`;
    else if (where === "Rates") ratesCard.innerHTML = `<h2>Exchange Rate</h2>${html}`;
    else if (where === "News") newsCard.innerHTML = `<h2>News Headlines</h2>${html}`;
}

async function apiGet(url) {
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`);
    }
    return data;
}

btnUser.addEventListener("click", async () => {
    setLoading(true);

    // reset placeholders
    userCard.innerHTML = `<h2>Random User</h2><div class="placeholder">Loading...</div>`;
    countryCard.innerHTML = `<h2>Country</h2><div class="placeholder">Waiting for user country...</div>`;
    ratesCard.innerHTML = `<h2>Exchange Rate</h2><div class="placeholder">Waiting for currency...</div>`;
    newsCard.innerHTML = `<h2>News Headlines</h2><div class="placeholder">Waiting for country...</div>`;

    try {
        // 1) Random user
        const user = await apiGet("/api/random-user");
        renderUser(user);

        // 2) Country info
        try {
            const country = await apiGet(`/api/country?name=${encodeURIComponent(user.country)}`);
            renderCountry(country);

            // 3) Exchange rates
            try {
                const rates = await apiGet(`/api/rates?base=${encodeURIComponent(country.currencyCode)}`);
                renderRates(rates);
            } catch (e) {
                renderError("Rates", e.message);
            }
        } catch (e) {
            renderError("Country", e.message);
        }

        // 4) News
        try {
            const news = await apiGet(`/api/news?country=${encodeURIComponent(user.country)}`);
            renderNews(user.country, news.articles);
        } catch (e) {
            renderError("News", e.message);
        }
    } catch (e) {
        renderError("User", e.message);
    } finally {
        setLoading(false);
    }
});
