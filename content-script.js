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
    "Facts": [
        {
            "Work" : [
                "UNSW researchers reveal: lack of mental activity doubles brain shrinkage in old age!",
                "Hey, you've been working for __ hours! Well done.",
                "You finished a task! Nice dude.",
                "Lazy people (aka couch potatoes) are unbearable... this you?",
                "Is your task overwhelmingly big? Consider splitting them up into smaller tasks.",
                "Is your environment too distracting? Move away...",
                "Still stressed? Try going for a brisk walk (it annoyingly works)."
            ]
        },
        {
            "Rest" : [
                "Hey, you've been resting for __ hours! Your brain thanks you.",
                "Is your brain super tired? Yeah you're in REST mode for a reason! Take a nap.",
                "Some people are weirdly workaholic... are you one of them?"
            ]
        }
    ],
    "Questions": [
        {
            "Work": [
                {"Textbox": [
                    "Need to memorize something? Explain it to me here in your own words.",
                    "What's worrying you?"
                ]},
                {"RadioButton": [
                    {"How much longer will you be procrastinating for?": "Fine I'll stop., 5 more minutes!, 15 minutes, 30 minutes"},
                    {"Is this site productive or for resting?": "Productive, Resting"}
                ]}
            ]
        },
        {
            "Rest": [
                "Wow __ minutes of rest... are you up for some work?"
            ]
        }
    ]
};

const styleCSS = `
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
    }
`;

function getQuote() {
    // Randomly pick a category (e.g., "Bible Verses", "Facts", "Questions")
    const category = Object.keys(quotes)[Math.floor(Math.random() * 3)];
    const subCategories = quotes[category];

    // TODO: change this to getting specific category depending on what the user is doing.
    const subCategoryIndex = 0 // Default is work.
    const subCategory = Object.keys(subCategories[subCategoryIndex])[0];

    // Get the quotes list for the chosen sub-category
    const statements = subCategories[subCategoryIndex][subCategory];

    if (category === "Questions") {
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
            console.log(options)
            return {
                questionType: 'RadioButton',
                questionText: Object.keys(questions[question])[0],
                options: options.split(", ")
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

function getDoveTextContainer() {
    const { questionType, questionText, options } = getQuote();
    console.log(questionText); // For debugging purposes

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
        style.innerHTML = styleCSS;
        document.head.appendChild(style);

        const doveText = getDoveTextContainer();
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