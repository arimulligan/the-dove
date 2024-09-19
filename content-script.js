function getQuote() {
    // Array of quotes for the dove to say
    const quotes = {
        "Bible Verses": [
            {
                "Work": [
                    "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters. (Colossians 3:23)",
                    "I can do all this through him who gives me strength. (Philippians 4:13)",
                    "Do you see someone skilled in their work? They will serve before kings; they will not serve before officials of low rank. (Proverbs 22:29)",
                    "And as for you, brothers and sisters, never tire of doing what is good. (2 Thessalonians 3:13)",
                    "Commit to the Lord whatever you do, and he will establish your plans. (Proverbs 16:3)",
                    "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds... (James 1:2-4)",
                    "Do everything without grumbling or arguing, so that you may become blameless and pure... (Philippians 2:14-15)",
                    "All hard work brings a profit, but mere talk leads only to poverty. (Proverbs 14:23)",
                    "One who is slack in his work is brother to one who destroys. (Proverbs 18:9)",
                    "Serve wholeheartedly, as if you were serving the Lord, not people. (Ephesians 6:7)",
                    "Those who work their land will have abundant food, but those who chase fantasies have no sense. (Proverbs 12:11)"
                ]
            },
            {
                "Rest": [
                    "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. (Philippians 4:6)",
                    "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. (Jeremiah 29:11)",
                    "You will eat the fruit of your labor; blessings and prosperity will be yours. (Psalm 128:2)",
                    "Commit your way to the Lord; trust in him and he will do this. (Psalm 37:5)",
                    "Come to me, all you who are weary and burdened, and I will give you rest. (Matthew 11:28)",
                    "Cast all your anxiety on him because he cares for you. (1 Peter 5:7)",
                    "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand. (Isaiah 41:10)",
                    "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight. (Proverbs 3:5-6)",
                    "There remains, then, a Sabbath rest for the people of God; for anyone who enters God's rest also rests from their works, just as God did from his. (Hebrews 4:9-10)",
                    "The Lord replied, “My Presence will go with you, and I will give you rest.” (Exodus 33:14)",
                    "I have told you these things, so that in me you may have peace. In this world, you will have trouble. But take heart! I have overcome the world. (John 16:33)"
                ]
            }
        ],
        "Questions/Statements": [
            {
                "Work": [
                    {"Textbox": [
                        "Need to memorize something? Explain it to me here in your own words.",
                        "What's worrying you?"
                    ]},
                    {"RadioButton": [
                        {"How much longer will you be procrastinating for?": "I'm working!, I'll rest for 5 minutes, I'll rest for 15 minutes, I'll rest for 30 minutes"},
                        {"Is this site distracting? Did you want to block it?": "Yes please, 10 more minutes then block it, No thanks"}
                    ]},
                    {"Button": [
                        {"UNSW researchers reveal: lack of mental activity doubles brain shrinkage in old age!": "Ew!"},
                        {"Hey, I see you've been productive! Well done.": "Why thank you"},
                        {"Couch potatoes are unbearable... this you?": "Haha"},
                        {"Is your environment too distracting? Move away...": "Mmhmm"},
                        {"Still stressed? Try going for a brisk walk (it annoyingly works).": "If you insist!"},
                    ]}
                ]
            },
            {
                "Rest": [
                    `Wow __ minutes of rest... are you up for some work?`,
                    "Hey, you've been resting nicely! Your brain thanks you.",
                    "Is your brain super tired? Yeah you're in REST mode for a reason! Take a nap.",
                    "Some people are weirdly workaholic... are you one of them?"
                ]
            }
        ]
    };

    // Randomly pick a category (e.g., "Bible Verses", "Facts/Questions")
    const category = Object.keys(quotes)[Math.floor(Math.random() * 2)];
    const subCategories = quotes[category];

    // getting work or rest category depending on what mode the user is in.
    let subCategoryIndex;
    chrome.storage.sync.get('mode', (data) => {
        subCategoryIndex = data.mode === 'rest' ? 1 : 0; // Default is work
    });
    const subCategory = Object.keys(subCategories[subCategoryIndex])[0];

    // Get the quotes list for the chosen sub-category
    const statements = subCategories[subCategoryIndex][subCategory];

    if (category === "Questions/Statements") {
        const questionObj = statements[Math.floor(Math.random() * statements.length)];
        const questionType = Object.keys(questionObj)[0];
        const questions = questionObj[questionType];

        if (questionType === 'Textbox') {
            return {
                questionType: 'Textbox',
                questionText: questions[Math.floor(Math.random() * questions.length)]
            };
        } else if (questionType === 'RadioButton') {
            const question = Object.keys(questions)[0];
            const options = Object.values(questions[question])[0];
            return {
                questionType: 'RadioButton',
                questionText: Object.keys(questions[question])[0],
                options: options.split(", ")
            };
        } else if (questionType === 'Button') {
            const question = Object.keys(questions)[0];
            const option = Object.values(questions[question])[0];
            return {
                questionType: 'Button',
                questionText: Object.keys(questions[question])[0],
                options: option
            };
        }
    } else {
        const selectedStatement = statements[Math.floor(Math.random() * statements.length)];
        return {
            questionType: 'Quote',
            questionText: selectedStatement
        };
    }
}

function getDoveTextContainer(flyDoveImg, risingBranchImg, flyingDoveGIFUrl) {
    const { questionType, questionText, options } = getQuote();

    const doveTextContainer = document.createElement('div');
    doveTextContainer.className = 'dove-text';

    const questionElement = document.createElement('div');
    questionElement.textContent = questionText;
    doveTextContainer.appendChild(questionElement);

    if (questionType === 'Textbox') {
        // Create a textbox for the user to answer
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type away...';
        input.addEventListener('keypress', (event)=> {
            if (event.key === 'Enter'){
                questionElement.textContent = 'Thanks for your response!\nDouble click me to fly away.'
                input.style.display = 'none';
            }
        })
        doveTextContainer.appendChild(input);
    } else if (questionType === 'RadioButton') {
        // Create radio buttons for the user to choose from
        options.forEach(option => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'dove-question';
            radio.value = option;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            doveTextContainer.appendChild(label);
            doveTextContainer.appendChild(document.createElement('br'));
        });
        questionElement.addEventListener('keypress', (event)=> {
            if (event.key === 'Enter'){
                // check if any radios have been selected
                if ($('input[name="dove-question"]:checked').length > 0) {
                    var selected = document.querySelector('input[name="dove-question"]:checked');
                    const selectedChoice = selected.value.toLowerCase();
                    if (options.length > 3) { // extending rest
                        if (selectedChoice == "I'm working!"){
                            questionElement.textContent = 'OK!\nDouble click me to fly away.';
                        } else {
                            const minutes = selectedChoice.match(new RegExp("\\d+"));
                            // TODO: change mode to rest mode, and set the timer to _ minutes.

                            questionElement.textContent = `You are now in rest mode for ${minutes} minutes. Enjoy!`;
                        }
                    } else { // blocking sites
                        if (selectedChoice == "Yes please"){
                            // TODO: block the current URL indefinitely
                        } else if (selectedChoice == "10 more minutes then block it"){
                            // TODO: wait for 5 minutes in work mode, then block and reload the site.
                        } else {
                            questionElement.textContent = 'OK!\nDouble click me to fly away.';;
                        }
                    }
                    selected.remove();
                }
            }
        })
    } else if (questionType === 'Button') {
        // show button user can click and then the dove flys away.
        const button = document.createElement('button');
        button.value = options;
        input.addEventListener('click', (event)=> {
            flyAway(doveTextContainer, flyDoveImg, risingBranchImg, flyingDoveGIFUrl);
        })
        doveTextContainer.appendChild(input);
    }
    return doveTextContainer;
}

// dove will remind if interval timer tells
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'doveReminding') {

        const existingDove = document.getElementById('The-Dove-Extension-Area');
        if (existingDove) {
            existingDove.remove();
        }

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
        flyDoveImg.style.animation = 'doveMoveDown 5s linear';
        flyDoveImg.title = 'Double click to soar away!'

        // Create the rising branch image element
        const risingBranchImg = document.createElement('img');
        risingBranchImg.src = standingBranchUrl;
        risingBranchImg.style.position = 'fixed';
        risingBranchImg.style.left = '70%';
        risingBranchImg.style.width = '400px';
        risingBranchImg.style.height = '250px';
        risingBranchImg.style.zIndex = '999'; // below the dove
        risingBranchImg.style.top = '68%';
        risingBranchImg.style.animation = 'branchMoveUp 5s linear';
        risingBranchImg.title = 'Double click to soar away!'

        // Append the images to the body
        const doveWorkArea = document.createElement('div');
        doveWorkArea.id = 'The-Dove-Extension-Area';
        doveWorkArea.appendChild(flyDoveImg);
        doveWorkArea.appendChild(risingBranchImg);
        document.body.appendChild(doveWorkArea);

        // Add the CSS animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes doveMoveDown {
                0% { top: -200px; }
                100% { top: 55%; }
            }
            @keyframes doveMoveUp {
                0% { top: 55%; }
                100% { top: -200px; }
            }
            @keyframes branchMoveUp {
                0% { top: 100%; }
                100% { top: 68%; }
            }
            @keyframes branchMoveDown {
                0% { top: 68%; }
                100% { top: 100%; }
            }
            #The-Dove-Extension-Area {
                .dove-text {
                    width: 200px;
                    position: fixed;
                    left: 60%;
                    top: 50%;
                    color: white;
                    background-color: #04668c;
                    padding: 20px;
                    border-radius: 50px;
                    z-index: 1001;
                    display: none;
                }
        
                input {
                    background-color: #04668c;
                    border-color: #0388A6;
                }
        
                input[type="radio"] {
                    position: relative;
                    opacity: 100;
                }
                
                img:hover {
                    cursor: grab;
                }
        
                *, label, div { font-family: Arial; }
                ::placeholder { color: rgba(255, 255, 255, 0.5); }
            }`;
        document.head.appendChild(style);

        const doveText = getDoveTextContainer(flyDoveImg, risingBranchImg, flyingDoveGIFUrl);
        flyDoveImg.addEventListener('animationend', (event) => {
            if (event.animationName == 'doveMoveDown') {
                // Replace the flying dove GIF with the standing dove image
                flyDoveImg.src = standingDoveUrl;
                flyDoveImg.style.animation = '';
                flyDoveImg.style.top = '61%';
                flyDoveImg.style.width = '100px';
                flyDoveImg.style.height = '100px';
                flyDoveImg.style.left = '80%';
    
                doveWorkArea.appendChild(doveText);
                doveText.style.display = 'block'; // Make the text visible
            } else {
                flyDoveImg.style.display = 'none';
                risingBranchImg.style.display = 'none';
            }
        });

        // Set a timeout to make the dove fly away after a while
        setTimeout(() => {
            flyAway(doveText, flyDoveImg, risingBranchImg, flyingDoveGIFUrl);
        }, 7000); // TODO: it's only 7 seconds timeout for debugging

        // to fly away
        flyDoveImg.addEventListener('dblclick', ()=> {
            flyAway(doveText, flyDoveImg, risingBranchImg, flyingDoveGIFUrl);
        });
        risingBranchImg.addEventListener('dblclick', ()=> {
            flyAway(doveText, flyDoveImg, risingBranchImg, flyingDoveGIFUrl);
        });
    } else {
        // Optionally, remove the GIF if it's not supposed to be shown
        const img = document.querySelector('img');
        if (img) img.remove();
    }
});

function flyAway(doveText, flyDoveImg, risingBranchImg, flyingDoveGIFUrl) {
    risingBranchImg.style.animation = 'branchMoveDown 5s linear';
    doveText.style.display = 'none';

    flyDoveImg.src = flyingDoveGIFUrl;
    flyDoveImg.style.animation = 'doveMoveUp 5s linear';
    flyDoveImg.style.left = '75%';
    flyDoveImg.style.width = '200px';
    flyDoveImg.style.height = '200px';
}