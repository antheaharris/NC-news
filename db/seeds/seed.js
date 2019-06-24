const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex, Promise) {
  const topicsInsertions = knex("topics").insert(topicData);
  const usersInsertions = knex("users").insert(userData);

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => Promise.all([topicsInsertions, usersInsertions]))
    .then(() => {
      const formattedArticles = formatDate(articleData);
      return knex("articles")
        .insert(formattedArticles)
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
