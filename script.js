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
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            const storySelectionScreen = document.getElementById('storySelectionScreen');
            storySelectionScreen.innerHTML = '';
            stories.forEach((story, index) => {
                const button = document.createElement('button');
                button.className = 'btn story-button';
                button.textContent = story.title;
                button.setAttribute('data-story-id', index);
                storySelectionScreen.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading stories:', error);
            document.getElementById('errorMessage').style.display = 'block';
        });
}

function selectStory(storyId) {
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            currentStory = stories[storyId];
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