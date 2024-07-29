async function fetchData() {
    const res = await fetch("https://ghoapi.azureedge.net/api/OCC_17");
    if (!res.ok) {
        console.error("Failed to fetch data");
        return;
    }
    const record = await res.json();
    document.getElementById("SpatialDim").innerHTML = record.value[0].SpatialDim;
    document.getElementById("Value").innerHTML = record.value[0].Value;
}
fetchData();