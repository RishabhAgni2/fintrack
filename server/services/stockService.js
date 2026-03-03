const axios = require("axios");
const { getCachedPrice, setCachedPrice } = require("./priceCache");

exports.getLivePrice = async (symbol) => {
  let upperSymbol = symbol.toUpperCase();

  // 🔥 Convert AlphaVantage NSE format to Finnhub format
  if (upperSymbol.endsWith(".NSE")) {
    upperSymbol = upperSymbol.replace(".NSE", ".NS");
  }

  // 1️⃣ Check cache first
  const cached = getCachedPrice(upperSymbol);
  if (cached) {
    console.log("Serving from cache:", upperSymbol);
    return cached;
  }

  console.log("Fetching from Finnhub:", upperSymbol);
console.log("Finnhub key:", process.env.FINNHUB_API_KEY);
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote`,
      {
        params: {
          symbol: upperSymbol,
          token: process.env.FINNHUB_API_KEY,
        },
      }
    );

    const data = response.data;

    // Finnhub response example:
    // {
    //   c: current price,
    //   h: high price,
    //   l: low price,
    //   o: open price,
    //   pc: previous close
    // }

    if (!data || !data.c) {
      console.error("Finnhub response:", data);
      throw new Error("Invalid Finnhub response");
    }

    const price = data.c;

    // Store in cache
    setCachedPrice(upperSymbol, price);

    return price;

  } catch (error) {
    console.error("FINNHUB ERROR:", error.message);
    throw new Error("Unable to fetch stock price");
  }
};