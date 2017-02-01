const diff = require('./diff')('2017-01-25');

describe( "Function isChange", function () {
	const o = {
    "First Name": "firstName",
    "Last Name": "lastName",
    "Extension": "ext",
    "Cell Number": "cell",
    "Alternative NumberEmergency Only": "alt",
    "Title": "title",
    "E-mail Address": "email"
  };
  const n = {
    "First Name": "firstName1",
    "Last Name": "lastName",
    "Extension": "ext",
    "Cell Number": "cell",
    "Alternative NumberEmergency Only": "alt",
    "Title": "title",
    "E-mail Address": "email"
  };

  it("when is changed", function () {
      expect(diff.isChanged(o, n)).toEqual(true);
  });
	it("when is same", function () {
      expect(diff.isChanged(o, o)).toEqual(false);
  });
});