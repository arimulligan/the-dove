// Check storage for showDove state
chrome.storage.local.get(['showDove'], (result) => {
    const showDove = result.showDove ?? false;

    if (showDove) {
        // URL of the doves images
        const flyingDoveGIFUrl = chrome.runtime.getURL('images/flyingDove.gif');
        const standingDoveUrl = chrome.runtime.getURL('images/standingBird.png');
        const standingBranchUrl = chrome.runtime.getURL('images/bigBranch.png');

        // Create the flying dove image element
        const flyDoveImg = document.createElement('img');
        flyDoveImg.src = flyingDoveGIFUrl;
        flyDoveImg.style.position = 'fixed';
        flyDoveImg.style.left = '75%';
        flyDoveImg.style.width = '200px';
        flyDoveImg.style.height = '200px';
        flyDoveImg.style.zIndex = '1000';
        flyDoveImg.style.animation = 'moveDown 5s linear';

        // Create the rising branch image element
        const risingBranchImg = document.createElement('img');
        risingBranchImg.src = standingBranchUrl;
        risingBranchImg.style.position = 'fixed';
        risingBranchImg.style.left = '70%';
        risingBranchImg.style.width = '400px';
        risingBranchImg.style.height = '250px';
        risingBranchImg.style.zIndex = '999'; // below the dove
        risingBranchImg.style.top = '68%';
        risingBranchImg.style.animation = 'moveUp 5s linear';

        // Append the images to the body
        document.body.appendChild(flyDoveImg);
        document.body.appendChild(risingBranchImg);

        // Add the CSS animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes moveDown {
                0% { top: -200px; }
                100% { top: 55%; }
            }
            @keyframes moveUp {
                0% { top: 90%; }
                100% { top: 68%; }
            }
            .dove-text {
                position: fixed;
                left: 77%;
                top: 58%;
                font-size: 20px;
                color: white;
                background-color: rgba(3,136,166, 0.5); /*lighter blue*/
                padding: 5px;
                border-radius: 5px;
                z-index: 1001;
                display: none;
            }
        `;
        document.head.appendChild(style);

        flyDoveImg.addEventListener('animationend', () => {
            // Replace the flying dove GIF with the standing dove image
            flyDoveImg.src = standingDoveUrl;
            flyDoveImg.style.animation = '';
            flyDoveImg.style.top = '61%';
            flyDoveImg.style.width = '100px';
            flyDoveImg.style.height = '100px';
            flyDoveImg.style.left = '80%';

            const doveText = document.createElement('div');
            doveText.className = 'dove-text';
            doveText.textContent = "I'm Dave the dove!";
            document.body.appendChild(doveText);
            doveText.style.display = 'block'; // Make the text visible
        });
    } else {
        // Optionally, remove the GIF if it's not supposed to be shown
        const img = document.querySelector('img');
        if (img) img.remove();
    }
});
