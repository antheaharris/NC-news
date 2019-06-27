const { updateCommentById } = require("../models/comments-models");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes)
    res.status(400).send({ msg: "no inc_vote key on request body" });
  else {
    updateCommentById(comment_id, inc_votes)
      .then(([comment]) => {
        if (!comment)
          return Promise.reject({
            status: 404,
            msg: "comment does not exist"
          });
        else res.status(200).send({ comment });
      })
      .catch(err => next(err));
  }
};
