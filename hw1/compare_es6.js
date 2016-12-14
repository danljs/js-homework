module.exports = compare = (oldData, newData) => {
  const result = { added: [], deleted: [], modified: [] };

  oldData.map(o => (c => (
    c.length === 0 ? result.deleted.push(o) : 
    JSON.stringify(c[0])!== JSON.stringify(o.ext) ? result.modified.push(c[0]) : '')
    )(newData.filter(n => (o.firstName === n.firstName && o.lastName === n.lastName)))
  );

  newData.map(n => oldData.filter(o => (n.firstName === o.firstName && n.lastName === o.lastName)).length === 0
    ? result.added.push(n) : '');
  return result;
}
