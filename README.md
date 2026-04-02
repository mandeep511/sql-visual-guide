# SQL Visual Guide

An interactive HTML learning resource for SQL — includes a visual reference guide and a hands-on playground with assignments.

## Files

- `sql_visual_guide.html` — visual reference guide with syntax examples, color-coded snippets, copy-to-clipboard, and interactive quizzes
- `styles.css` — styling for the visual guide
- `script.js` — interactivity for the guide (progress bar, copy buttons, smooth scrolling, quiz logic)
- `playground.html` — interactive SQL playground with a live in-browser database
- `playground.css` — styling for the playground
- `playground.js` — playground logic (query execution, assignments, hints, mode switching)
- `assignments.js` — structured assignment definitions (parts, questions, hints, expected output)
- `default-database.js` — sample database schema and seed data (customers, orders, products, etc.)

## Features

### Visual Guide
- Covers core SQL concepts: SELECT, WHERE, JOINs, aggregates, subqueries, and more
- Syntax-highlighted code snippets with one-click copy
- Embedded multiple-choice quizzes per section
- Reading progress bar

### SQL Playground
- Runs SQL queries entirely in the browser using [sql.js](https://sql.js.org/) (SQLite via WebAssembly)
- **Free Play** mode — write and run any query against the sample database
- **Assignments** mode — guided exercises with hints and automatic answer checking
- Schema browser to explore tables and columns
- Query history
- No backend required — works fully offline
