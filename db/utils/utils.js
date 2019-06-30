exports.formatDate = list => {
  let newListArray = list.map(item => {
    item.created_at = new Date(item.created_at);
    return item;
  });
  return newListArray;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    let { belongs_to, created_by, created_at, ...restOfComment } = comment;
    return {
      ...restOfComment,
      article_id: articleRef[belongs_to],
      author: comment.created_by,
      created_at: new Date(comment.created_at)
    };
  });
};
