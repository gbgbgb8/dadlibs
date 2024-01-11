document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const storySelection = document.getElementById('story-selection');
    const wordSelection = document.getElementById('word-selection');
    const storyOutput = document.getElementById('story-output');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    let currentStory = null;

    // Fetch stories and populate selection
    fetch('stories.json')
        .then(response => response.json())
        .then(data => {
            data.stories.forEach((story, index) => {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-primary', 'story-button');
                button.textContent = story.title;
                button.onclick = () => selectStory(index, data.stories);
                storySelection.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error fetching stories:', error);
            app.innerHTML = '<p>Error loading stories. Please try again later.</p>';
        });

    function selectStory(index, stories) {
        currentStory = stories[index];
        wordSelection.innerHTML = '';
        wordSelection.style.display = 'block';
        storyOutput.style.display = 'none';

        Object.keys(currentStory.blanks).forEach(blank => {
            const formGroup = document.createElement('div');
            formGroup.classList.add('form-group');
            const label = document.createElement('label');
            label.classList.add('form-label');
            label.textContent = `Choose a ${blank.split('-')[0]}`;
            const select = document.createElement('select');
            select.classList.add('form-select');
            select.id = blank;
            currentStory.blanks[blank].forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });
            formGroup.appendChild(label);
            formGroup.appendChild(select);
            wordSelection.appendChild(formGroup);
        });

        const submitButton = document.createElement('button');
        submitButton.classList.add('btn', 'btn-primary');
        submitButton.textContent = 'Generate Story';
        submitButton.onclick = generateStory;
        wordSelection.appendChild(submitButton);
    }

    function generateStory() {
        let storyText = currentStory.template;
        Object.keys(currentStory.blanks).forEach(blank => {
            const word = document.getElementById(blank).value;
            storyText = storyText.replace(`[${blank}]`, word);
        });

        storyOutput.innerHTML = `<p>${storyText}</p>`;
        storyOutput.style.display = 'block';
        wordSelection.style.display = 'none';
    }

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});
