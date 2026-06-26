import "./ShopCard.css";

function ShopCard({ shop, onClick }) {
  return (
    <div className="shop-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <img className="shop-image" src={shop.photo.pc.l} alt={shop.name} />

      <div className="shop-content">
        <h2 className="shop-title">{shop.name}</h2>

        <p className="shop-area">住所: {shop.address}</p>

        <p className="shop-budget">予算: {shop.budget?.name}</p>

        <a
          className="shop-button"
          href={shop.urls.pc}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          ホットペッパーで見る
        </a>
      </div>
    </div>
  );
}

export default ShopCard;
