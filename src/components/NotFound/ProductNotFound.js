import React from "react";
import { Link } from "react-router";

const ProductNotFound = () => {
  const loader = document.getElementById("spinner-box-load");
  if (loader) {
    loader.style.display = "none";
  }
  return (
    <div className="container">
      <h1>Fehler: Produkt nicht verfügbar</h1>

      <p>
        Leider können wir das gesuchte Produkt nicht mehr anbieten. Schauen Sie
        sich stattdessen unsere Hauptseite an, um andere grossartige Produkte zu
        entdecken, die Ihren Anforderungen entsprechen könnten.
      </p>

      <p className="not-found-main-wrapper">
        <button className="not-found-main-wrapper-btn">
          <Link to="/kaufen" style={{ color: "black" }}>
            Homepage besuchen
          </Link>
        </button>
      </p>

      <p>
        Vielen Dank für Ihr Verständnis und zögern Sie nicht, uns bei Fragen
        oder Hilfe zu kontaktieren. Wir stehen Ihnen gerne zur Verfügung.
      </p>
    </div>
  );
};

export default ProductNotFound;
