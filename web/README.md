## Getting Started

First, install the dependencies:

```bash
cd api
pnpm install
```

```bash
cd web
pnpm install
```

you'll need to setup a Postgres DB, you can do this locally just to test.

```bash
createdb <db_name>
```

You'll have to add two tables to your db

a `users` and a `posts` tables

The commands for these are as follows

`users`:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

`posts`:

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sub_title VARCHAR(255),
    category: TEXT,
    type: TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Then you'll need to create a `.env` file in the `api` directory with the following content:

```bash
DATABASE_URL=postgres://<username>:<password>@localhost:5432/<db_name>
```

you will also have to add a JWT_SECRET to the `.env` file

Since this is just local you can just do something like

`JWT_SECRET='<Some String>'`

You will then need to add this some `JWT_SECRET` to the `.env` file in the `web` directory

Lastly, you need to add a `API_URL` to the `.env` file in the `web` directory, this would just be
localhost:3000 for local development.

once that is completed you can then start the server and app

To run the project:

`cd api`

```bash
pnpm dev
```

Open a new terminal and run the following command

`cd web`

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result of the web app

From here, you can register an account, and then login. Once you're logged in, you can click the admin button to create a new post.

# Accessibility

This project focuses on accessibility. The web app is fully accessible and can be navigated using only a keyboard. The colors are also accessible and the contrast ratio is high enough to be readable. The web app is also responsive and can be used on mobile devices.

I focused on these areas of accessibility:

- Keyboard navigation
- Color contrast for colorblind users
- Screen reader support
- Responsive design for mobile users

Google Light house is currently giving all pages 100% for accessibility.
