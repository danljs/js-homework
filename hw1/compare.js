module.exports = function compare(oldData, newData) {
  const result = {
    added: [],
    deleted: [],
    modified: [],
  };

  oldData.map(function (o) {
    const compared = newData.filter(function (n) {
      return o.firstName === n.firstName && o.lastName === n.lastName;
    });

    if (compared.length === 0) {
      result.deleted.push(o);
    } else if (compared[0].ext !== o.ext
            || compared[0].cell !== o.cell
            || compared[0].alt !== o.alt
            || compared[0].title !== o.title
            || compared[0].email !== o.email) {
      result.modified.push(compared[0]);
    }
  });

  newData.map(function (n) {
    const compared = oldData.filter(function (o) {
      return n.firstName === o.firstName && n.lastName === o.lastName;
    });

    if (compared.length === 0) {
      result.added.push(n);
    }
  });
  return result;
}
