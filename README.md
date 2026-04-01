# Todo App

Simple React todo app with task persistence and timestamps.

## Features

- Add tasks with creation date/time
- Edit task text inline
- Mark tasks as done/undone
- Delete tasks and keep a deleted-task history
- Persist tasks and deleted history in `localStorage`
- Display tasks in a table with Added / Updated timestamps

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Available scripts

### `npm start`

Start the development server.

### `npm run build`

Create a production build in the `build` folder.

## Project structure

- `src/App.js` — main todo application logic
- `src/App.css` — table layout and styling
- `src/index.js` — app bootstrap

## Notes

Tasks are saved in browser `localStorage`, so refreshes keep your current list.
Deleted tasks are preserved separately and show when they were removed.
