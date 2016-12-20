module.exports = function compare(oldData, newData) {
  const result = {
    added: [],
    deleted: [],
    modified: [],
  };

  const oldDataObj = {};

  oldData.map(o => oldDataObj[o.email] = o);

  newData.map(n => {
    const o = oldDataObj[n.email];
    if (!o) {
      result.added.push(n);
    } else {
      if (o.firstName !== n.firstName ||
        o.lastName !== n.lastName ||
        o.ext !== n.ext ||
        o.cell !== n.cell ||
        o.alt !== n.alt ||
        o.title !== n.title) {
        result.modified.push({ before: o, after: n });
      }
      delete oldDataObj[n.email];
    }
  });
  result.deleted.push(oldDataObj);
  return result;
}
