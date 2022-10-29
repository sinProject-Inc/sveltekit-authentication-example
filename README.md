# SvelteKit Authentication Example

This is an example of how tow to sign up, sing in, authenticate, send PIN code mai, sign in with Google and sign in with Twitter.

## Sign up

This project does not have a sign up process. If the account does not exist in the database when you sign in, it will be created automatically.

## Sign in

You can sign in with only your email address and PIN code. To confirm your email address, this project will email you a PIN code.
You can also sign in with Google and sign in with Twitter.

1. Local accounts via email
2.  Sign in with Google
3. Sign in with Twitter

## Prerequisites

- [MySQL Community Server 8.0.30](https://dev.mysql.com/downloads/mysql/) or higher
- [Node.js](https://nodejs.org/) 18.4.0 or higher
- npm 8.13.2 or higher
- Gmail account for sendmail

### Prerequisites for signing in with Google (option)

- [Google API client ID and setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)

### Prerequisites for signing in with Twitter (option)

- [Twitter developer account and setup](https://developer.twitter.com/en/docs/apps/overview)

## Setting up the Gmail for sending PIN code emails

1. Visit [Google Account - Security](https://myaccount.google.com/security)
1. Turn on 2-Step Verification
1. Create an app password

## Setting up the project

Here are the steps:

1. Get the project and setup:

```bash
# Clone the repo to your current directory
git clone https://github.com/sinProject-Inc/sveltekit_authentication_example.git

# Install the dependencies
cd /sveltekit_authentication_example
npm install
```

2. Create a database named sveltekit_authentication
3. Create a .env file by copying .env.example at the top level of the project
4. rewrite the env file:

```env
DATABASE_URL="mysql://user:password@localhost:3306/sveltekit_authentication"

GMAIL_USER="username@gmail.com"
GMAIL_PASS="google_app_password"

TWITTER_CLIENT_ID="(option)"
TWITTER_CLIENT_SECRET="(option)"
```

5. Push the initial schema to the database:

```bash
npx prisma db push
```

## Run locally

```bash
# Start the server and open the app in a new browser tab
npm run dev -- --open
```

## Set initial data only for the first time

Write Roles and Lifetime settings:

visit http://localhost:5173/initialize_database

## How to sign in

1. visit sign in page
2. Enter your email address
3. Check your email for PIN code
4. Enter PIN code

## My ask of you

Please report any issues [here](https://github.com/sinProject-Inc/sveltekit_authentication_example/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc). [Pull requests](https://github.com/sinProject-Inc/sveltekit_authentication_example/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc) are encouraged especially as SvelteKit is evolving rapidly.
