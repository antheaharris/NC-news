process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");

chai.use(chaiSorted);

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe.only("/api", () => {
    describe("/topics", () => {
      it("GET topics - status:200 - responds with array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.an("array");
            expect(topics[0]).to.contain.keys("description", "slug");
          });
      });
    });
    describe("/users", () => {
      describe("/:usersname", () => {
        describe("GET", () => {
          it("GET - status:200 - responds with user object that corresponds with the given username endpoint", () => {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user.username).to.equal("butter_bridge");
                expect(user).to.contain.keys("username", "avatar_url", "name");
              });
          });
          it("status: 404 - when given a username that doesn't exist", () => {
            return request(app)
              .get("/api/users/invalidName")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("username does not exist");
              });
          });
        });
      });
    });
    describe("/articles", () => {
      describe("GET", () => {
        it("GET status:200 - responds with array of article object, inc comment_count property", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0]).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
        });
        it('GET status: 200, defaults response to be sorted by "created_at"', () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .expect(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("created_at");
            });
        });
        it("GET status: 200, articles can be sorted by other valid columns when passed in the query", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .expect(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("votes");
            });
        });
        it("GET status: 200, articles order defaults to descending", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .expect(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("created_at");
            });
        });
        it("GET status: 200, articles order can be sorted by url order query", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .expect(({ body: { articles } }) => {
              expect(articles).to.be.ascendingBy("created_at");
            });
        });
        it("GET status:200, articles can be filtered by author when valid username passed as query", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .expect(({ body: { articles } }) => {
              expect(articles.length).to.equal(3);
              expect(articles[0].author).to.equal("butter_bridge");
            });
        });
        it("GET status:200, articles can be filtered by topic when valid topic is passed as query", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .expect(({ body: { articles } }) => {
              expect(articles.length).to.equal(11);
              expect(articles[0].topic).to.equal("mitch");
            });
        });
        it("status: 400 - when sort_by query is a column that does not exist", () => {
          return request(app)
            .get("/api/articles?sort_by=notAColumn")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('column "notAColumn" does not exist');
            });
        });
        it("status: 404 - when passed a username that does not exist ", () => {
          return request(app)
            .get("/api/articles?author=notAUsername")
            .expect(404)
            .expect(({ body }) => {
              expect(body.msg).to.equal("resource not found");
            });
        });
        it("status: 404 - when passed a topic that does not exist ", () => {
          return request(app)
            .get("/api/articles?topic=notATopic")
            .expect(404)
            .expect(({ body }) => {
              expect(body.msg).to.equal("resource not found");
            });
        });
      });
      describe("/:article_id", () => {
        describe("GET", () => {
          it("GET status:200 - responds with article object - inc comment_count", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.contain.keys(
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at",
                  "comment_count"
                );
                expect(article.comment_count).to.equal("13");
              });
          });
          it("status: 404 - when given an article_id that does not exist", () => {
            return request(app)
              .get("/api/articles/943789")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("article does not exist");
              });
          });
          it("status: 400 - when given an invalid article_id", () => {
            return request(app)
              .get("/api/articles/notAnId")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "notAnId"'
                );
              });
          });
        });
        describe("PATCH", () => {
          it("PATCH /:article_id - 200 - updates the vote count", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(101);
              });
          });
          it("status 400 - no 'inc_votes' key on request body", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("no inc_vote key on request body");
              });
          });
          it("status 400 - invalid inc_votes value", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "dog" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "NaN"'
                );
              });
          });
          it("status: 404 - when given an article_id that does not exist", () => {
            return request(app)
              .patch("/api/articles/943789")
              .send({ inc_votes: 1 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("article does not exist");
              });
          });
          it("status: 400 - when given an invalid article_id", () => {
            return request(app)
              .patch("/api/articles/notAnId")
              .send({ inc_votes: 1 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "notAnId"'
                );
              });
          });
        });
        describe("/comments", () => {
          describe("POST", () => {
            it("POST status: 201 - responds with posted comment", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  username: "butter_bridge",
                  body: "help! stuck in the comments"
                })
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment).to.contain.keys(
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  );
                });
            });
            it("status: 404 - when article_id does not exist", () => {
              return request(app)
                .post("/api/articles/9999/comments")
                .send({
                  username: "butter_bridge",
                  body: "help! stuck in the comments"
                })
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("article does not exist");
                });
            });
            it("status: 400 - when given invalid article_id", () => {
              return request(app)
                .post("/api/articles/notanid/comments")
                .send({
                  username: "butter_bridge",
                  body: "help! stuck in the comments"
                })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    'invalid input syntax for integer: "notanid"'
                  );
                });
            });
            it("status: 400 - no username key", () => {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  notName: "butter_bridge",
                  notBody: "help! stuck in the comments"
                })
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    'null value in column "author" violates not-null constraint'
                  );
                });
            });
          });
          describe("GET", () => {
            it("GET status:200 - responds with an array of comments for the given article_id", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments.length).to.equal(13);
                  expect(body.comments[0]).to.contain.keys(
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "body"
                  );
                });
            });
            it("GET status: 200, defaults the response to be sorted by 'created_at' ", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy("created_at");
                });
            });
            it("GET status: 200, comments can be sorted by other valid columns when passed in the query", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy("votes");
                });
            });
            it("GET status: 200, comments order defaults to descending", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=created_at")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy("created_at");
                });
            });
            it("GET status: 200, comments order can be sorted by url order query", () => {
              return request(app)
                .get("/api/articles/1/comments?order=asc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.ascendingBy("created_at");
                });
            });
            it("status: 404 - when given an article_id that does not exist", () => {
              return request(app)
                .get("/api/articles/987654321/comments")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("article does not exist");
                });
            });
            it("status: 400 - when given an invalid article_id", () => {
              return request(app)
                .get("/api/articles/notAnId/comments")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal(
                    'invalid input syntax for integer: "notAnId"'
                  );
                });
            });
            it("status: 400 - when sort_by query is a column that does not exist ", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=colour")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('column "colour" does not exist');
                });
            });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it("PATCH /:comment_id - 200 - updates the vote count", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(17);
              });
          });
          it("status 400 - no 'inc_votes' key on request body", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("no inc_vote key on request body");
              });
          });
          it("status 400 - invalid inc_votes value", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: "dog" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "NaN"'
                );
              });
          });
          it("status: 404 - when given an comment_id that does not exist", () => {
            return request(app)
              .patch("/api/comments/943789")
              .send({ inc_votes: 1 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("comment does not exist");
              });
          });
          it("status: 400 - when given an invalid comment_id", () => {
            return request(app)
              .patch("/api/comments/notAnId")
              .send({ inc_votes: 1 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'invalid input syntax for integer: "notAnId"'
                );
              });
          });
        });
        describe("DELETE", () => {
          it("DELETE status: 204 - responds with no content, when passed a valid comment_id", () => {
            return request(app)
              .delete("/api/comments/1")
              .expect(204);
          });
          it("status: 404 - when passed an inexistent comment_id", () => {
            return request(app)
              .delete("/api/comments/987654321")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "no comment with that comment_id found"
                );
              });
          });
          it("status: 400 - when passed an invalid comment_id", () => {
            return request(app)
              .delete("/api/comments/notAnId")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('invalid input syntax for integer: "notAnId"');
              });
          });
        });
      });
    });
  });
});
