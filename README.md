# CareerAI — Career Skill & Roadmap Analyzer

Enter your current skills, a career goal and your experience level. The app shows how ready you are, which skills you are missing, free resources for each one, and a 12-week study plan.

**Live demo:** https://sevim-123.github.io/CareerAI/

![Screenshot of the analyzer](assets/screenshot.png)

## Features

- **6 career tracks:** Artificial Intelligence, Web Development, Data Science, Mobile Development (Flutter), Cybersecurity, DevOps / Cloud
- **3 experience levels:** each level has its own roadmap and its own 12-week study plan
- **Transparent readiness score:** the formula is shown under every result
- **Skill gap breakdown:** click a recommended skill once you have learned it and the score updates
- **Free learning resources:** links to official docs and free courses for every missing skill
- **Study plan progress tracking:** tick each period when you finish it
- **Share link:** the whole analysis, including your progress, is stored in the URL
- **Save as PDF:** a print-friendly layout that includes all resource links
- **Smart input:** recognizes common spellings (`JS`, `Node`, `ML`, `PyTorch`, `AWS`…) and Turkish goal names (`Yapay Zekâ`, `Siber Güvenlik`, `Veri Bilimi`…)
- Works offline, has no build step or dependencies, and is keyboard and screen-reader friendly

## How the score works

```
score = (core skills you have or completed / 6) × 85  +  min(15, foundational skills × 7)
```

Each track has 6 **core skills** and a few **foundational skills**. For example, C/C++ count as foundational for AI, and Excel and R count as foundational for Data Science.

## Project structure

```
index.html      page markup
style.css       styles (including print / PDF layout)
careers.js      all career data: tracks, roadmaps, study plans, aliases, resources
app.js          app logic
assets/         favicon, social preview image, screenshot
```

## Adding a new career track

1. Open `careers.js` and copy one of the objects inside `tracks`.
2. Give it a new key and fill in `label`, `aliases`, 6 `skills`, `skillNotes`, a `roadmap` (3 phases per level) and a `studyPlan` (6 rows per level).
3. Add every new skill to `skillAliases` (in lowercase) and add links for it to `resources`.

Nothing else needs to change. The new track appears in the goal buttons automatically.

## Roadmap

- [ ] AI-generated plans for any career goal, using a serverless API proxy
- [ ] Extract skills automatically from a pasted CV
- [ ] Turkish interface
