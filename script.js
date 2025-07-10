const table = document.querySelector(".table_body");
const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error("Error fetching API data:", error);
    alert("API request failed. You may have hit the rate limit.");
  }
}

function renderData(data) {
  table.innerHTML = "";

  data.forEach((item) => {
    const priceChange = parseFloat(item.price_change_24h).toFixed(2);
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>
                <div class="coin-img">
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="coin-name">${item.name}</div>
                </div>
            </td>
            <td>${item.symbol.toUpperCase()}</td>
            <td>${item.current_price}</td>
            <td>${item.total_volume}</td>
            <td class="percentage_change">${priceChange}%</td>
            <td>Mkr Cap: ${item.market_cap}</td>
        `;

    const changeCell = row.querySelector(".percentage_change");
    changeCell.style.color = priceChange < 0 ? "red" : "green";

    table.appendChild(row);
  });
}

function updateTable(searchTerm) {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      renderData(filtered);
    })
    .catch((err) => {
      console.error("Error filtering data:", err);
    });
}

document.getElementById("search_bar").addEventListener("keyup", (e) => {
  updateTable(e.target.value);
});

function MarketCap() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const sorted = data.sort((a, b) => b.market_cap - a.market_cap);
      renderData(sorted);
    });
}

function Percentage() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const sorted = data.sort(
        (a, b) => b.price_change_24h - a.price_change_24h
      );
      renderData(sorted);
    });
}

fetchData();
