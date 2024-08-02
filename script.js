// async function fetchData() {
//     const res = await fetch("https://ghoapi.azureedge.net/api/OCC_17");
//     if (!res.ok) {
//         console.error("Failed to fetch data");
//         return;
//     }
//     const record = await res.json();
//     document.getElementById("SpatialDim").innerHTML = record.value[0].SpatialDim;
//     document.getElementById("Value").innerHTML = record.value[0].Value;
// }
// fetchData();

// async function getCurrentTab() {
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }