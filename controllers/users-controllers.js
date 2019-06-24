const { selectByUsername } = require("../models/users-models");

exports.sendByUsername = (req, res, next) => {
  const { username } = req.params;
  selectByUsername(username)
    .then(([user]) => {
      if (!user)
        return Promise.reject({
          status: 404,
          msg: "username does not exist"
        });
      else res.status(200).send({ user });
    })
    .catch(err => {
      next(err);
    });
};
