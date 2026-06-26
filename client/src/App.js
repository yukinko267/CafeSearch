import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ShopCard from "./components/ShopCard";
import RandomButton from "./components/RandomButton";
import "./App.css";

const dataUrl = (fileName) => `${process.env.PUBLIC_URL}/data/${fileName}`;

function App() {
  const [shops, setShops] = useState([]);
  const [randomShops, setRandomShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [nearbySpots, setNearbySpots] = useState([]);
  const [nearbyByShopId, setNearbyByShopId] = useState({});
  const [driveKey, setDriveKey] = useState(0);
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
    setSelectedShop(null);
    setNearbySpots([]);
  };

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    setNearbySpots(nearbyByShopId[shop.id] || []);
    setDriveKey((current) => current + 1);
  };

  return (
    <main className="app-shell">
      <Header />

      {error && <p className="app-error">{error}</p>}

      <RandomButton onClick={getRandomShop} />

      <section className={`results-layout ${selectedShop ? "has-selection" : ""}`}>
        <div className="shop-list" aria-label="候補のカフェ">
          {randomShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              isSelected={selectedShop?.id === shop.id}
              onClick={() => handleShopClick(shop)}
            />
          ))}
        </div>

        {selectedShop && (
          <aside className="nearby-panel" aria-live="polite">
            <div className="route-lane" key={driveKey}>
              <span className="route-origin">Cafe</span>
              <div className="route-line" />
              <div className="car-icon" aria-hidden="true">
                <span className="car-body" />
                <span className="car-window" />
                <span className="car-wheel car-wheel-front" />
                <span className="car-wheel car-wheel-back" />
              </div>
              <span className="route-destination">Spot</span>
            </div>

            <div className="nearby-heading">
              <p className="nearby-label">3km以内のおすすめスポット</p>
              <h2>{selectedShop.name} 周辺</h2>
            </div>

            {nearbySpots.length > 0 ? (
              <div className="spot-list">
                {nearbySpots.map((spot, index) => (
                  <div className="spot-item" key={spot.xid || spot.name}>
                    <span className="spot-number">{index + 1}</span>
                    <div>
                      <h3>{spot.name || "名前なし"}</h3>
                      {spot.dist && <p>約 {Math.round(spot.dist)}m</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="spot-empty">
                このカフェ周辺のスポットはまだ登録されていません。
              </p>
            )}
          </aside>
        )}
      </section>
    </main>
  );
}

export default App;
