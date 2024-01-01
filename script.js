let currentStory = null;
let selectedWords = {};

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    document.getElementById('gameContainer').classList.add('dark-mode');
    loadStories();
    setupEventListeners();
}

function setupEventListeners() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.addEventListener('click', handleGameClick);
}

function handleGameClick(event) {
    if (event.target.matches('.story-button')) {
        selectStory(event.target.getAttribute('data-story-id'));
    } else if (event.target.matches('.word-button')) {
        selectWord(event.target.getAttribute('data-word-type'), event.target.textContent);
    } else if (event.target.matches('#playAgainButton')) {
        playAgain();
    } else if (event.target.matches('#shareButton')) {
        shareStory();
    }
}

function loadStories() {
    const storyFiles = ['story00.json', 'story01.json', 'story02.json'];
    const storyPromises = storyFiles.map(storyFile => fetch(storyFile).then(response => {
        if (!response.ok) {
            throw new Error(`Story file ${storyFile} not found`);
        }
        return response.json();
    }).catch(error => {
        console.error(`Error loading ${storyFile}:`, error.message);
        displayErrorMessage();
        return null;
    }));

    Promise.all(storyPromises).then(allStories => {
        displayStorySelection(allStories.filter(Boolean));
        document.getElementById('errorMessage').style.display = 'none';
    }).catch(error => {
        console.error('Error processing stories:', error);
        displayErrorMessage();
    });
}

function displayStorySelection(allStories) {
    const storySelectionScreen = document.getElementById('storySelectionScreen');
    storySelectionScreen.innerHTML = '';
    allStories.forEach((stories, index) => {
        stories.forEach(story => {
            const button = document.createElement('button');
            button.className = 'btn story-button';
            button.textContent = story.title;
            button.setAttribute('data-story-id', `story${String(index).padStart(2, '0')}-${story.title}`);
            storySelectionScreen.appendChild(button);
        });
    });
}

function displayErrorMessage() {
    document.getElementById('errorMessage').style.display = 'block';
}

function selectStory(storyId) {
    const [storyFile, title] = storyId.split('-');
    fetch(storyFile)
        .then(response => response.json())
        .then(storyData => {
            currentStory = storyData.find(story => story.title === title);
            displayWordSelection();
        })
        .catch(error => {
            console.error('Error loading story:', error);
            displayErrorMessage();
        });
}

function displayWordSelection() {
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
}

function selectWord(wordType, selectedWord) {
    const wordTypePrefix = wordType.split('-')[0];
    selectedWords[wordType] = selectedWord;
    document.querySelectorAll(`[data-word-type^="${wordTypePrefix}-"]`).forEach(button => {
        button.classList.remove('selected');
    });
    event.target.classList.add('selected');
    checkIfAllWordsSelected();
}

function checkIfAllWordsSelected() {
    const allBlanksFilled = currentStory.blanks.every((type, index) => selectedWords.hasOwnProperty(`${type}-${index}`));
    if (allBlanksFilled) {
        assembleStory();
    }
}

function assembleStory() {
    let storyText = currentStory.template;
    Object.entries(selectedWords).forEach(([key, value]) => {
        const regex = new RegExp(`\\[${key.split('-')[0]}\\]`, 'g');
        storyText = storyText.replace(regex, value);
    });
    displayFinalStory(storyText);
}

function displayFinalStory(storyText) {
    const finalStoryScreen = document.getElementById('finalStoryScreen');
    finalStoryScreen.innerHTML = `<p>${storyText}</p>`;
    finalStoryScreen.appendChild(createButton('Share Story', 'shareButton'));
    finalStoryScreen.appendChild(createButton('Play Again', 'playAgainButton'));
    document.getElementById('wordSelectionScreen').style.display = 'none';
    finalStoryScreen.style.display = 'block';
}

function createButton(text, id) {
    const button = document.createElement('button');
    button.id = id;
    button.className = 'btn';
    button.textContent = text;
    return button;
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
