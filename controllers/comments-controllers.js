const {
  updateCommentById,
  removeComment
} = require("../models/comments-models");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
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
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(delCount => {
      if (delCount === 1) res.sendStatus(204);
      else if (delCount === 0)
        return Promise.reject({
          status: 404,
          msg: "no comment with that comment_id found"
        });
    })
    .catch(err => next(err));
};
