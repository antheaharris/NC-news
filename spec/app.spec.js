process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe.only("/api", () => {
    describe("/topics", () => {
      it("GET topics - status:200 - responds with array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("description", "slug");
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
              .then(({ body }) => {
                expect(body.article.votes).to.equal(101);
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
          // it("status 400 - other keys on request body", () => {
          //   return request(app)
          //     .patch("/api/articles/1")
          //     .send({ inc_votes: 1, name: "Mitch" })
          //     .expect(400)
          //     .then(({ body }) => {
          //       expect(body.msg).to.equal("other properties on request body");
          //     });
          // });
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
                    "no username/body key on comment post request"
                  );
                });
            });
          });
        });
      });
    });
  });
});
