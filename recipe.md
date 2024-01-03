# Recipe for Creating New DadLibs Stories

## Overview
Creating a story for DadLibs involves crafting a fun narrative with blanks for players to fill. The new format allows each blank to have its unique set of word options, enhancing the gameplay experience.

## Steps

### 1. Define the Title
- Start with a catchy and descriptive title that sets the tone for your story. 
- Example: "My Trip to the Moon".

### 2. Craft the Story Template
- Write a two or three-paragraph story with a whimsical narrative.
- Include a clear beginning, middle, and end.

### 3. Identify the Blanks
- Select words or phrases in the story to replace with placeholders.
- Common placeholders are adjectives, nouns, verbs, adverbs, places, and names.

### 4. Organize Placeholders
- Create a list of placeholders in your story, formatted as `[wordType-index]`.
- Example: `[noun-1]`, `[verb-1]`, `[adjective-1]`.

### 5. Create Unique Word Options
- For each placeholder, provide a unique set of words.
- Ensure no repetition of words across different placeholders of the same type.

### 6. Format as JSON
- Structure your story in JSON format with the title, template, blanks, and options.
- Each set of options should be keyed by its corresponding placeholder.

### 7. Review and Test
- Proofread your story and test it in the DadLibs game.
- Ensure it provides a fun and engaging experience.

---

## Example JSON Structure

```json
{
    "title": "My Trip to the Moon",
    "template": "Yesterday, I took an [adjective-1] trip to the moon! I rode on a [noun-1] powered by [noun-2].",
    "blanks": ["adjective-1", "noun-1", "noun-2"],
    "options": {
        "adjective-1": ["bumpy", "sparkly", "weightless"],
        "noun-1": ["space scooter", "rocket", "shuttle"],
        "noun-2": ["banana peel", "teacup", "asteroid"]
    }
}
