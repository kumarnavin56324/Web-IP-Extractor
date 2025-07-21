const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Extraction route
app.post("/extract", async (req, res) => {
  const urls = req.body.urls;
  const results = [];

  for (const url of urls) {
    try {
      const { data } = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(data);
      const sources = [];

      $("iframe, video, source, embed").each((_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src");
        if (src && !sources.includes(src)) sources.push(src);
      });

      results.push({ url, sources: sources.length ? sources : ["No sources found"] });
    } catch {
      results.push({ url, sources: ["Failed to fetch"] });
    }
  }

  res.json({ results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server started on http://localhost:${PORT}`));
