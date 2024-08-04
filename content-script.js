// Check storage for showDove state
chrome.storage.local.get(['showDove'], (result) => {
    const showDove = result.showDove ?? false; // Default to true if undefined

    if (showDove) {
        // URL of the GIF to overlay
        const gifUrl = chrome.runtime.getURL('images/flyingDove.gif');
        console.log('GIF URL:', gifUrl);

        // Create an image element
        const img = document.createElement('img');
        img.src = gifUrl;
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.left = '50%';
        img.style.transform = 'translateX(-50%)';
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.zIndex = '1000';
        img.style.animation = 'moveDown 5s linear infinite';

        // Append the image to the body
        document.body.appendChild(img);

        console.log('GIF appended to body');

        // Add the CSS animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes moveDown {
                0% { top: 0; }
                100% { top: 100vh; }
            }
        `;
        document.head.appendChild(style);

        console.log('CSS animation added');
    } else {
        // Optionally, remove the GIF if it's not supposed to be shown
        const img = document.querySelector('img');
        if (img) img.remove();
    }
});
