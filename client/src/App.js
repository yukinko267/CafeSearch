import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ShopCard from "./components/ShopCard";
import RandomButton from "./components/RandomButton";

const dataUrl = (fileName) => `${process.env.PUBLIC_URL}/data/${fileName}`;

function App() {
  const [shops, setShops] = useState([]);
  const [randomShops, setRandomShops] = useState([]);
  const [nearbySpots, setNearbySpots] = useState([]);
  const [nearbyByShopId, setNearbyByShopId] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [shopsRes, nearbyRes] = await Promise.all([
          fetch(dataUrl("shops.json")),
          fetch(dataUrl("nearby-spots.json")),
        ]);

        if (!shopsRes.ok) {
          throw new Error("shops.json could not be loaded");
        }

        const shopsData = await shopsRes.json();
        const nearbyData = nearbyRes.ok ? await nearbyRes.json() : {};

        setShops(Array.isArray(shopsData.shops) ? shopsData.shops : []);
        setNearbyByShopId(nearbyData);
      } catch (err) {
        console.error(err);
        setError(
          "店舗データを読み込めませんでした。GitHub Actionsでデータ生成が完了しているか確認してください。"
        );
      }
    };

    fetchStaticData();
  }, []);

  const getRandomShop = () => {
    const shuffled = [...shops].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setRandomShops(selected);
    setNearbySpots([]);
  };

  const handleShopClick = (shop) => {
    setNearbySpots(nearbyByShopId[shop.id] || []);
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <Header />

      {error && <p style={{ color: "#c62828", textAlign: "center" }}>{error}</p>}

      <RandomButton onClick={getRandomShop} />

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {randomShops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} onClick={() => handleShopClick(shop)} />
        ))}
      </div>

      {nearbySpots.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>このお店の近くのおすすめスポット（3km以内）</h3>

          {nearbySpots.map((spot) => (
            <div key={spot.xid || spot.name}>{spot.name || "名前なし"}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
