async function extract() {
  const input = document.getElementById("inputUrls").value.trim();
  const urls = input.split(/\r?\n/).filter(Boolean);
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  if (urls.length === 0) return;
  if (urls.length > 5000) {
    alert("Please paste up to 5000 URLs.");
    return;
  }

  const response = await fetch("/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls })
  });

  const data = await response.json();

  data.results.forEach(item => {
    const row = document.createElement("tr");
    const urlCell = document.createElement("td");
    const srcCell = document.createElement("td");

    urlCell.textContent = item.url;
    srcCell.innerHTML = item.sources.map(s => `<div>${s}</div>`).join("");

    row.appendChild(urlCell);
    row.appendChild(srcCell);
    tbody.appendChild(row);
  });
}
