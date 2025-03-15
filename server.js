import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5001;
let cachedData = null;
let lastFetchTime = 0;

// API route to fetch crypto data from CoinGecko
app.get("/api/cryptos", async (req, res) => {
    const now = Date.now();

    // Only fetch from API if more than 30 seconds have passed
    if (!cachedData || now - lastFetchTime > 30000) {
        try {
            console.log("Fetching fresh data from CoinGecko...");
            const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
                params: {
                    vs_currency: "usd",
                    order: "market_cap_desc",
                    per_page: 10,
                    page: 1,
                    sparkline: false
                }
            });

            cachedData = response.data; // Store response in cache
            lastFetchTime = now; // Update last fetch time
        } catch (error) {
            console.error("Error fetching data:", error);
            return res.status(500).json({ error: "Failed to fetch cryptocurrency data" });
        }
    }

    res.json(cachedData); // Return cached data
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});