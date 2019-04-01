[![Build Status](https://travis-ci.org/SurgamSurgam/Notetorious.svg?branch=master)](https://travis-ci.org/SurgamSurgam/Notetorious)

# Notetorious

Notetorious is a full-stack web application fully inspired by Evernote and built with Postgres, Express, React/Redux and NodeJS. Like Evernote, Notetorious helps users stay organized by allowing them to create, modify, tag and store notes in notebooks.

## Features

- Authentication using Passport.js for frontend/backend
- User account creation via signup and login or guest/demo login
- User can create, edit, delete notes and notebooks
- Rich-text editing via Quill.js
- Notes are searchable by title or content
- Notes can be favorited and added as shortcuts

## Screenshots

![Notetorious](./docs/images/notetorious-landing-page.png "landing")

![Notetorious](./docs/images/notetorious-login-page.png "login")

![Notetorious](./docs/images/notetorious-all-notes-page.png "all notes")

![Notetorious](./docs/images/notetorious-notebooks-page.png "notebooks")

![Notetorious](./docs/images/notetorious-shortcuts-page.png "shortcuts")

## Project Design Docs

View the original _[project proposal](./original-readme.md)_ to see to a README including all [wireframes](./wireframes), [api endpoints](./api-endpoints.md), [database schema](./schema.md), a sample React [component hierarchy](./component-hierarchy.md), a [sample state](./sample-state.md), and the implementation timeline that covers 3 weeks.

## Future Implementations

- OAuth
- Allow sharing of notes/notebooks via social media
- Collaboration on notes
- Multiple sessions
- Add checklist/todo
- Create Reminders for Notes
- Autosave while editing
