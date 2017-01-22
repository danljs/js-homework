
module.exports = function compare(oldData, newData, key, keys) {
  const result = { added: [], deleted: [], modified: [] };
  const oldDataObj = {};

  const isChanged = (o, n) => {
    for(let i = 0; i < keys.length; i++){
      if(o[keys[i]] !== n[keys[i]]) {
        return true ;
      }
    }
    return false ;
  };

  oldData.map(o => oldDataObj[o[key]] = o);

  newData.map(n => {
    const o = oldDataObj[n[key]];
    if (!o) {
      result.added.push(n);
    } else {
      isChanged(o, n) ? result.modified.push({ before: o, after: n }) : '';
      delete oldDataObj[n[key]];
    }
  });

  result.deleted.push(oldDataObj);

  return result;
}
