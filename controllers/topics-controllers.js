const { selectTopics } = require("../models/topics-models");

exports.sendAllTopics = (req, res, next) => {
  selectTopics().then(topics => {
    res.status(200).send({ topics });
  });
};
