export const switchcase = cases => defaultCase => key =>
  (f => (f instanceof Function ? f() : f))(
    (cases => defaultCase => key =>
      Object.prototype.hasOwnProperty.call(cases, key)
        ? cases[key]
        : defaultCase)(cases)(defaultCase)(key)
  );
