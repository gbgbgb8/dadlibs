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
   const storyFiles = ['story00.json', 'story01.json', 'story02.json', 'story03.json'];
   const storyPromises = storyFiles.map((storyFile, index) => 
       fetch(storyFile)
           .then(response => {
               if (!response.ok) {
                  throw new Error(`Story file ${storyFile} not found`);
               }
               return response.json();
           })
           .catch(error => {
               console.error(`Error loading ${storyFile}:`, error.message);
               displayErrorMessage(`Error loading story ${index + 1}. Please try again later.`);
               return [];
           })
   );

   Promise.all(storyPromises)
       .then(allStories => {
           allStories = allStories.flat();
           displayStorySelection(allStories);
           document.getElementById('errorMessage').style.display = 'none';
       })
       .catch(error => {
           console.error('Error processing stories:', error);
           displayErrorMessage('Error processing stories. Please try again later.');
       });
}

function displayStorySelection(allStories) {
   const storySelectionScreen = document.getElementById('storySelectionScreen');
   storySelectionScreen.innerHTML = '';
   allStories.forEach((story, index) => {
       const button = document.createElement('button');
       button.className = 'btn story-button';
       button.textContent = story.title;
       button.setAttribute('data-story-id', `story${String(index).padStart(2, '0')}`);
       storySelectionScreen.appendChild(button);
   });
}

function displayErrorMessage(message) {
   const errorMessageDiv = document.getElementById('errorMessage');
   errorMessageDiv.textContent = message;
   errorMessageDiv.style.display = 'block';
}

function selectStory(storyId) {
   const storyFile = `${storyId}.json`;

   fetch(storyFile)
       .then(response => response.json())
       .then(storyData => {
           currentStory = storyData;
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
    currentStory.blanks.forEach(wordType => {
        const div = document.createElement('div');
        div.innerHTML = `<p>Choose a ${wordType.split('-')[0]}:</p>`;
        currentStory.options[wordType].forEach(word => {
            const button = document.createElement('button');
            button.className = 'btn word-button';
            button.textContent = word;
            button.setAttribute('data-word-type', wordType);
            div.appendChild(button);
        });
        wordSelectionScreen.appendChild(div);
    });
    document.getElementById('storySelectionScreen').style.display = 'none';
    wordSelectionScreen.style.display = 'block';
}

function selectWord(wordType, selectedWord) {
    selectedWords[wordType] = selectedWord;
    document.querySelectorAll(`[data-word-type="${wordType}"]`).forEach(button => {
        button.classList.remove('selected');
    });
    event.target.classList.add('selected');
    checkIfAllWordsSelected();
}

function checkIfAllWordsSelected() {
    const allBlanksFilled = currentStory.blanks.every((type, index) => selectedWords.hasOwnProperty(`${type}-${index}`));
    if (allBlanksFilled) {
        showDadLibItButton();
    }
}

function showDadLibItButton() {
    const wordSelectionScreen = document.getElementById('wordSelectionScreen');
    const dadLibItButton = createButton('DadLib It!', 'dadLibItButton');
    dadLibItButton.addEventListener('click', assembleStory);
    wordSelectionScreen.appendChild(dadLibItButton);
}

function assembleStory() {
    let storyText = currentStory.template;
    Object.entries(selectedWords).forEach(([key, value]) => {
        storyText = storyText.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });
    displayFinalStory(storyText);
    document.getElementById('dadLibItButton').style.display = 'none'; // Hide the button after use
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
    const dadLibItButton = document.getElementById('dadLibItButton');
    if (dadLibItButton) {
        dadLibItButton.style.display = 'block';
    }
}


function shareStory() {
    const storyText = document.querySelector('#finalStoryScreen p').textContent;
    const shareText = `${document.location.origin}${document.location.pathname}?story=${encodeURIComponent(currentStory.title)}&words=${encodeURIComponent(JSON.stringify(selectedWords))}`;
    navigator.clipboard.writeText(shareText);
 }
 