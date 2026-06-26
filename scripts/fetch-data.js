const fs = require("fs/promises");
const path = require("path");

const outputDir = path.join(__dirname, "..", "client", "public", "data");
const hotpepperUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
const openTripRadius = 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

async function fetchHotpepperShops() {
  const apiKey = process.env.HOTPEPPER_API_KEY || process.env.HotPepper_API_KEY;

  if (!apiKey) {
    throw new Error("HOTPEPPER_API_KEY is required");
  }

  const params = new URLSearchParams({
    key: apiKey,
    large_area: "Z063",
    range: "5",
    count: "100",
    genre: "G014",
    format: "json",
  });

  const data = await fetchJson(`${hotpepperUrl}?${params.toString()}`);
  return data.results?.shop || [];
}

async function fetchNearbySpots(shop) {
  const apiKey = process.env.OPENTRIP_API_KEY;

  if (!apiKey || !shop.lat || !shop.lng) {
    return [];
  }

  const params = new URLSearchParams({
    radius: String(openTripRadius),
    lon: shop.lng,
    lat: shop.lat,
    format: "json",
    apikey: apiKey,
  });

  const data = await fetchJson(
    `https://api.opentripmap.com/0.1/en/places/radius?${params.toString()}`
  );

  return Array.isArray(data)
    ? data
        .filter((spot) => spot.name)
        .slice(0, 3)
        .map((spot) => ({
          xid: spot.xid,
          name: spot.name,
          kinds: spot.kinds,
          dist: spot.dist,
        }))
    : [];
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const shops = await fetchHotpepperShops();
  const nearbyByShopId = {};

  for (const shop of shops) {
    nearbyByShopId[shop.id] = await fetchNearbySpots(shop);
    await sleep(200);
  }

  await fs.writeFile(
    path.join(outputDir, "shops.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), shops }, null, 2)}\n`
  );
  await fs.writeFile(
    path.join(outputDir, "nearby-spots.json"),
    `${JSON.stringify(nearbyByShopId, null, 2)}\n`
  );

  console.log(`Generated ${shops.length} shops in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
