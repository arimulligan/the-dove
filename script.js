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

function addOverlayImage(src, opacity) {
    const img = new Image();
    img.src = src;
    Object.assign(img.style, {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        opacity,
        objectFit: 'cover',
        objectPosition: 'center center',
        pointerEvents: 'none'
    });
    document.body.appendChild(img);
}

addOverlayImage('images/download.jpg', 0.5);

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.scripting
    .executeScript({
        target : {tabId : getCurrentTab()},
        files : [ "script.js" ],
    })
    .then(() => console.log("injected script file"));