let currentStory = null;
let selectedWords = {};

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    loadStories();
    document.getElementById('gameContainer').addEventListener('click', (event) => {
        if (event.target.matches('.story-button')) {
            selectStory(event.target.getAttribute('data-story-id'));
        } else if (event.target.matches('.word-button')) {
            selectWord(event.target.getAttribute('data-word-type'), event.target.textContent);
        } else if (event.target.matches('#playAgainButton')) {
            playAgain();
        } else if (event.target.matches('#shareButton')) {
            shareStory();
        }
    });
}

function loadStories() {
    const storyFiles = ['story01.json', 'story02.json', 'story03.json']; // Add your story file names here

    const storyPromises = storyFiles.map(storyFile => 
        fetch(storyFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Story file ${storyFile} not found`);
                }
                return response.json();
            })
            .catch(error => {
                console.warn(`Error loading ${storyFile}:`, error.message);
                return null;
            })
    );

    Promise.all(storyPromises)
        .then(allStories => {
            const storySelectionScreen = document.getElementById('storySelectionScreen');
            storySelectionScreen.innerHTML = '';
            allStories.forEach((stories, index) => {
                if (stories) {
                    stories.forEach(story => {
                        const button = document.createElement('button');
                        button.className = 'btn story-button';
                        button.textContent = story.title;
                        button.setAttribute('data-story-id', `${index}-${story.title}`);
                        storySelectionScreen.appendChild(button);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error processing stories:', error);
        });
}

function selectStory(storyId) {
    // Split storyId to get the index and title
    const [index, title] = storyId.split('-');
    const storyFile = `story0${index}.json`;

    fetch(storyFile)
        .then(response => response.json())
        .then(allStories => {
            currentStory = allStories.find(story => story.title === title);
            const wordSelectionScreen = document.getElementById('wordSelectionScreen');
            wordSelectionScreen.innerHTML = '';
            currentStory.blanks.forEach((wordType, index) => {
                const div = document.createElement('div');
                div.innerHTML = `<p>Choose a ${wordType}:</p>`;
                currentStory.options[wordType].forEach(word => {
                    const button = document.createElement('button');
                    button.className = 'btn word-button';
                    button.textContent = word;
                    button.setAttribute('data-word-type', `${wordType}-${index}`);
                    div.appendChild(button);
                });
                wordSelectionScreen.appendChild(div);
            });
            document.getElementById('storySelectionScreen').style.display = 'none';
            wordSelectionScreen.style.display = 'block';
        })
        .catch(error => console.error('Error loading story:', error));
}

function selectWord(wordType, selectedWord) {
    selectedWords[wordType] = selectedWord;
    document.querySelectorAll(`[data-word-type^="${wordType.split('-')[0]}"]`).forEach(button => {
        button.classList.remove('selected');
    });
    document.querySelector(`[data-word-type="${wordType}"]`).classList.add('selected');
    const allBlanksFilled = currentStory.blanks.every((type, index) => selectedWords[`${type}-${index}`]);
    if (allBlanksFilled) {
        assembleStory();
    }
}

function assembleStory() {
    let storyText = currentStory.template;
    for (const key in selectedWords) {
        storyText = storyText.replace(`[${key.split('-')[0]}]`, selectedWords[key]);
    }
    document.getElementById('finalStoryScreen').innerHTML = `<p>${storyText}</p>`;
    const shareButton = document.createElement('button');
    shareButton.id = 'shareButton';
    shareButton.className = 'btn';
    shareButton.textContent = 'Share Story';
    document.getElementById('finalStoryScreen').appendChild(shareButton);
    const playAgainButton = document.createElement('button');
    playAgainButton.id = 'playAgainButton';
    playAgainButton.className = 'btn';
    playAgainButton.textContent = 'Play Again';
    document.getElementById('finalStoryScreen').appendChild(playAgainButton);
    document.getElementById('wordSelectionScreen').style.display = 'none';
    document.getElementById('finalStoryScreen').style.display = 'block';
}

function playAgain() {
    selectedWords = {};
    document.getElementById('finalStoryScreen').style.display = 'none';
    document.getElementById('storySelectionScreen').style.display = 'block';
}

function shareStory() {
    const storyText = document.querySelector('#finalStoryScreen p').textContent;
    const shareText = encodeURIComponent(`Check out my DadLibs story: "${storyText}"`);
    const url = `https://twitter.com/intent/tweet?text=${shareText}`;
    window.open(url, '_blank');
}
