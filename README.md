# Northcoders News API

NC News is a Reddit style web application designed to act as a repository for news articles. The relational database stores the Articles, Comments, Topics, and Users.

**Hosted**: https://nc-newsbeat.herokuapp.com/api

## Getting Started

# Prerequisites

- node version 10
- PostgreSQL version 11
- npm version 6
- API Testing tool (e.g insomnia)

## Installation

1. Clone this repository
   ```
   git clone https://github.com/antheaharris/NC-news.git
   ```
2. cd into the repository
   ```
   cd NC-news
   ```
3. Install the dependencies
   ```
   npm install
   ```
4. Run the "setup-dbs" script
   ```
   npm run setup-dbs
   ```
5. Run the "seed" script
   ```
   npm run seed
   ```
6. Run the "host" script to start running the server locally on port 9090
   ```
   npm run start
   ```
7. To stop running the server user use ctrl + c

## Usage

Once the server is up and running the following endpoint will be available.

Note: GET requests can be ran from the browser using "localhost:9090" before the chosen endpoint. All other methods require an API testing tool.

### **/api**

**GET**

- will respond with an object containing the all available endpoints along with a description of what those endpoint will return.
- The URL should resemble - "localhost:9090/api"

### **/api/topics**

**GET**

- responds with an array of all topics

Example response:

```
{
  "topics": [
    {
      "slug": "coding",
      "description": "Code is love, code is life"
    },
    {
      "slug": "football",
      "description": "FOOTIE!"
    },
    {
      "slug": "cooking",
      "description": "Hey good looking, what you got cooking?"
    }
  ]
}
```

### **/api/articles**

**GET**

- will respond with an array of all articles

Example response:

```
{
  "total_count": 12,
  "articles": [
    {
      "article_id": 1,
      "title": "Example title",
      "body": "Example body",
      "votes": 100,
      "topic": "Example topic",
      "author": "Example author",
      "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
      "comment_count": "13"
    },
    {
      "article_id": 3,
      "title": "Example title",
      "body": "Example body",
      "votes": 0,
      "topic": "Example topic",
      "author": "Example author",
      "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
      "comment_count": "0"
    }
  ]
}
```

- **Query example** /api/articles?author=[**author**]&topic=[**topic**]&sort_by=[**column**]&order=[**order**]"

Query rules:

```
{
  "author": "FILTER, by the username",
  "topic": "FILTER, by topic",
  "column": [
    "article_id",
    "title",
    "body",
    "votes",
    "topic",
    "author",
    "created_at",
    "comment_count"
  ],
  "order": ["asc", "desc"]
}
```

### **/api/articles/:article_id**

**GET**

**note** `:article_id` must be an integer

- will respond with an article object for the given article_id

Example response:

```
{
  "article": {
    "article_id": 1,
    "title": "Living in the shadow of a great man",
    "body": "I find this existence challenging",
    "votes": 100,
    "topic": "mitch",
    "author": "butter_bridge",
    "created_at": "2018-11-15T12: 21: 54.000Z",
    "comment_count": "13"
  }
}
```

**PATCH**

- will respond with an object containing the updated article

Example body:

```
{
  "inc_votes": 1
}
```

Example response:

```
"response": {
    "article": {
      "article_id": 1,
      "title": "Living in the shadow of a great man",
      "body": "I find this existence challenging",
      "votes": 102,
      "topic": "mitch",
      "author": "butter_bridge",
      "created_at": "2018-11-15T12: 21: 54.000Z",
      "comment_count": "13"
    }
  }
```

### **/api/articles/:article_id/comments**

**GET**

**note** `:article_id` must be an integer

- will respond with an array of comment objects for the given article_id"

Example response:

```
{
  "comments": [
    {
      "comment_id": 2,
      "author": "butter_bridge",
      "article_id": 1,
      "votes": 14,
      "created_at": "2016-11-22T12: 36: 03.000Z",
      "body": "Example comment body"
    }
  ]
}
```

- **Query example** /api/articles?sort_by=[**column**]&order=[**order**]"

Query rules:

```
{
  "column": ["comment_id", "body", "votes", "author", "created_At"],
  "order": ["asc", "desc"]
}
```

**POST**

- will respond with an object containing the newly added comment

Example body:

```
{
  "username": "username_here",
  "body": "body_here"
}
```

Example response:

```
{
  "comment": {
    "comment_id": 19,
    "author": "username_here",
    "article_id": 1,
    "votes": 0,
    "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
    "body": "body_here"
  }
}
```

### **/api/comments/:comment_id**

**note** `:article_id` must be an integer

**PATCH**

- will respond with an object containing the updated comment

Example body:

```
{
  "inc_votes": 1
}
```

Example response:

```
{
  "comment": {
    "comment_id": 2,
    "author": "username_here",
    "article_id": 1,
    "votes": 17,
    "created_at": "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
    "body": "body_here"
  }
}
```

**DELETE**

- will respond with a status 204: with no body

### **/api/users/:username**

**GET**

- will respond with an object containing the given user

Example response:

```
{
  "user": {
    "username": ":username",
    "avatar_url": "https: //avatars2.githubusercontent.com/u/24394918?s=400&v=4",
    "name": "paul"
  }
}
```

## Running the tests

To run the automated test, run the "test" script

```
npm test
```

## Built with

- Express.js
- Knex.js
- postgreSQL
- Mocha & Chai (TDD)

## Author

Anthea Harris (antheaharris)
