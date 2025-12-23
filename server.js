import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const {
    RANDOMUSER_API_KEY,
    RESTCOUNTRIES_API_KEY,
    EXCHANGERATE_API_KEY,
    NEWS_API_KEY
} = process.env;

function requireEnv(name) {
    if (!process.env[name]) {
        throw new Error(`Missing env var: ${name}`);
    }
}

app.get("/api/random-user", async (req, res) => {
    try {
        // RandomUser
        const response = await fetch("https://randomuser.me/api/?results=1", {
            headers: {
                "X-API-KEY": RANDOMUSER_API_KEY || "NOT_REQUIRED"
            }
        });

        if (!response.ok) {
            return res.status(502).json({ error: "RandomUser API failed" });
        }

        const data = await response.json();
        const u = data.results?.[0];

        if (!u) return res.status(502).json({ error: "RandomUser empty result" });

        const streetName = u.location?.street?.name ?? "N/A";
        const streetNumber = u.location?.street?.number ?? "N/A";

        res.json({
            firstName: u.name?.first ?? "N/A",
            lastName: u.name?.last ?? "N/A",
            gender: u.gender ?? "N/A",
            picture: u.picture?.large ?? "",
            age: u.dob?.age ?? "N/A",
            dob: u.dob?.date ?? "N/A",
            city: u.location?.city ?? "N/A",
            country: u.location?.country ?? "N/A",
            fullAddress: `${streetName} ${streetNumber}`.trim()
        });
    } catch (e) {
        res.status(500).json({ error: "Server error in random-user" });
    }
});

app.get("/api/country", async (req, res) => {
    try {

        // REST Countries
        const { name } = req.query;
        if (!name) return res.status(400).json({ error: "Missing country name" });

        const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(
            name
        )}?fullText=true`;

        const response = await fetch(url, {
            headers: {
                "X-API-KEY": RESTCOUNTRIES_API_KEY || "NOT_REQUIRED"
            }
        });

        if (!response.ok) {
            return res.status(502).json({ error: "REST Countries API failed" });
        }

        const data = await response.json();
        const c = data?.[0];
        if (!c) return res.status(502).json({ error: "Country not found" });

        const countryName =
            c.name?.common ?? c.name?.official ?? "N/A";

        const capital = Array.isArray(c.capital) ? c.capital[0] : (c.capital ?? "N/A");

        // languages
        const languagesObj = c.languages ?? {};
        const languages = Object.values(languagesObj);
        const languagesText = languages.length ? languages.join(", ") : "N/A";

        // currencies
        const currenciesObj = c.currencies ?? {};
        const currencyCodes = Object.keys(currenciesObj);
        const currencyCode = currencyCodes[0] ?? "N/A";
        const currencyName = currencyCode !== "N/A"
            ? (currenciesObj[currencyCode]?.name ?? "N/A")
            : "N/A";

        const flag = c.flags?.png ?? c.flags?.svg ?? "";

        res.json({
            countryName,
            capital,
            languages: languagesText,
            currencyCode,
            currencyName,
            flag
        });
    } catch (e) {
        res.status(500).json({ error: "Server error in country" });
    }
});

app.get("/api/rates", async (req, res) => {
    try {
        requireEnv("EXCHANGERATE_API_KEY");

        const { base } = req.query;
        if (!base) return res.status(400).json({ error: "Missing base currency" });

        const url = `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/${encodeURIComponent(
            base
        )}`;

        const response = await fetch(url);
        if (!response.ok) {
            return res.status(502).json({ error: "ExchangeRate API failed" });
        }

        const data = await response.json();
        const rates = data?.conversion_rates ?? {};

        const usd = rates.USD;
        const kzt = rates.KZT;

        res.json({
            base,
            USD: typeof usd === "number" ? usd : null,
            KZT: typeof kzt === "number" ? kzt : null
        });
    } catch (e) {
        res.status(500).json({ error: "Server error in rates" });
    }
});

app.get("/api/news", async (req, res) => {
    try {
        requireEnv("NEWS_API_KEY");

        const { country } = req.query;
        if (!country) return res.status(400).json({ error: "Missing country" });

        const url = new URL("https://newsapi.org/v2/everything");
        url.searchParams.set("q", country);
        url.searchParams.set("language", "en");
        url.searchParams.set("pageSize", "20");
        url.searchParams.set("sortBy", "publishedAt");

        const response = await fetch(url.toString(), {
            headers: { "X-Api-Key": NEWS_API_KEY }
        });

        if (!response.ok) {
            return res.status(502).json({ error: "NewsAPI failed" });
        }

        const data = await response.json();
        const articles = Array.isArray(data.articles) ? data.articles : [];

        const needle = country.toLowerCase();

        const filtered = articles
            .filter(a => (a?.title ?? "").toLowerCase().includes(needle))
            .slice(0, 5)
            .map(a => ({
                title: a.title ?? "N/A",
                image: a.urlToImage ?? "",
                description: a.description ?? "",
                url: a.url ?? "",
                source: a.source?.name ?? "N/A"
            }));

        res.json({
            country,
            count: filtered.length,
            articles: filtered
        });
    } catch (e) {
        res.status(500).json({ error: "Server error in news" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
