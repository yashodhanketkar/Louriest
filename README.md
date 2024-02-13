# Louriest

- [Louriest](#louriest)
  - [Description](#description)
  - [Perquisites](#perquisites)
  - [Installation](#installation)
  - [Dependencies](#dependencies)
  - [License](#license)

## Description

A small scale personal moderation and quality of life bot for discord.
This project is built with [discord.js][1] library.

## Perquisites

This application requires nodejs, discord bot application, and mongodb database.
Follow these links to setup these perquisites.

- [Install node][2]
- [Setup bot][3]
- [Setup database][4]

## Installation

```bash
# Clone repository
git clone https://github.com/yashodhanketkar/Louriest

# Install dependencies
pnpm -i or npm -i or yarn

# Store bot token inside environment variable or .env file in root directory
LOU_TOKEN="your bots token"
DATABASE_URL="your atlas mongodb database"

# Deploy commands
pnpm deploy or npm run deploy or yarn deploy

# Run application
pnpm start or npm run start or yarn start

# Generate docs
pnpm doc or npm run doc or yarn doc
```

## Dependencies

| Name       | Version | Type | Uses                                   |
| ---------- | ------- | ---- | -------------------------------------- |
| discord.js | 14.14.1 | core | Access discord API                     |
| prisma     | 5.9.1   | core | Access and perform database operations |
| nodemon    | 3.0.3   | dev  | Reload bot during development process  |
| jsdoc      | 4.0.2   | dev  | Generate docs (html files)             |

## License

[MIT License](LICENSE)

<!-- References -->

[1]: https://discord.js.org/ "Discord.js official page"
[2]: https://nodejs.org/en "Node.js website"
[3]: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot "Setting up a bot application"
[4]: https://www.mongodb.com/docs/atlas/getting-started/ "Setup atlas mongodb database"
