# Voting app for interview exercises

This Rails and React application is the starting point for our Voting app
interview exercise. You may not need all the various files included to complete
the assignment, but they are here in case they help you move faster! Please
modify anything you need to in order to meet the requirements and show us your
own approach.

## Installation

Development environment:

* Ruby v3.1.2
* [Bundler](https://bundler.io/)
* Node v20.18.2
* Yarn v1.22.19
* git
* [SQLite3](https://www.sqlite.org/)

## Running the app

```sh
bundle exec rails server
```

Visit [http://localhost:3000](http://localhost:3000) in your browser

For asset live reloading, run:
```sh
./bin/shakapacker-dev-server
```

```
Test pending
```

## Description
A simple Rails + React application that lets users “log in” with an email, password, zip, cast or write in a vote for a candidate (max 10 total write-ins), and view live results in a separate dashboard. All business logic (one vote per user, one write-in per user, max 10 candidates) is enforced in Rails models/controllers; the React frontend consumes JSON endpoints and renders a minimal, accessible UI.

### Features
	
  1.	Fake Login
	•	Users “sign in” with an email, password, and ZIP code.
	•	If the email doesn’t exist, a new Voter record is created.
	•	Email is forced to lowercase and treated as unique; ZIP is stored on first login (or updated on subsequent logins).

	2.	Vote & Write-In Workflow
	•	Each voter can cast exactly one vote (any candidate).
	•	Each voter can write in a candidate exactly once, subject to a global cap of 10 total candidates (including write-ins).
	•	If the user writes in a new candidate, that automatically counts as their vote.
	•	All write-ins and votes are linked via a Vote join model (voter_id, candidate_id).
	•	Business rules enforced both at the model level (validations) and controller level (guard clauses).

	3.	Unauthenticated “Results” Dashboard
	•	Anyone (no login required) can hit GET /results and see a JSON list of all candidates + their vote counts, ordered descending by votes.
	•	React renders that data in a responsive table (WCAG-friendly colors, alternate-row shading, proper heading semantics, keyboard focus styles).

	4.	React-Only Frontend
	•	All UI elements (Login form, Voting page, Results page) are built in React components.
	•	Rails only serves a single HTML shell (<div id="root">), and all JSON data is fetched client-side using fetch(..., credentials: 'same-origin') so the Rails session cookie travels automatically.
	•	No ERB templates are used for any of the user-facing pages.

### Why Certain Decisions Were Made
	
  1.	“Fake” Login Without Password Verification
	•	The requirement asked for email + ZIP (password field is present but not actually verified).
	•	I store session[:voter_id] = voter.id. All API calls rely on that session cookie to identify the current voter.
	•	I skip real password authentication to keep things simple; React does not need to manage a bearer token—Rails session cookie handles it.
	
  2.	“One Vote / One Write-In” Business Logic
	•	I added two boolean columns on voters:
	•	wrote_in tracks if they’ve already used their write-in privilege.
	•	voted tracks if they’ve cast any vote.
	•	Controllers check those flags before creating a new Candidate or new Vote.
	•	Models reinforce that at the DB level:
	•	validates :voter_id, uniqueness: true on Vote ensures no double votes, even if two requests race.
	•	validate :max_candidates_not_exceeded, on: :create in Candidate prevents creation of more than 10 total candidates.
	•	Enforcing rules in both model validations and controller guard clauses prevents inconsistent states.
	
  3.	Rails Session + React’s fetch(credentials: ‘same-origin’)
	•	By default, fetch does not send cookies. I explicitly add credentials: 'same-origin' to each request so Rails knows which voter is logged in.
	•	I skip CSRF only for JSON requests so that POST /login, POST /api/v1/candidates, POST /api/v1/votes, and DELETE /logout all work without having to embed an authenticity token in each React call.
	
  4.	API Namespacing Under /api/v1
	•	Clear separation between web pages and JSON API endpoints.
	•	Versioning (v1) makes it easy to roll out future API changes without breaking the frontend.
	
  5.	Single HTML Shell for React
	•	I serve only one ERB view (home/index.html.erb) with a <div id="root">.
	•	React Router intercepts client-side routes (/login, /vote, /results) and renders the correct component.
	•	Any unknown path (e.g. /foo) is redirected back to /login by React Router logic.
	
  6.	WCAG-Friendly CSS & Responsive Design
	•	All colors meet a minimum contrast ratio (text is dark #111827 on near-white backgrounds).
	•	Inputs and buttons have visible focus outlines.
	•	Font sizes and touch targets meet or exceed 16px / 44px recommendations.
	•	Tables in “Results” have an ARIA-friendly structure; alternate row shading enhances readability.
	•	Components use semantic HTML (<main>, <h1>, <ul>, <table>, role="alert" for error messages).
	
  7.	No ERB Views for Login/Voting/Results
	•	The requirement was to use React for all user-facing pages. Rails only serves JSON or a single HTML shell.
	•	Any scaffolded ERB files for these pages were removed or never used.
	•	The only ERB files left are layout shells (layouts/application.html.erb) and home/index.html.erb (contains <div id="root">).

