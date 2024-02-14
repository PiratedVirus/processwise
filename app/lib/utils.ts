

export const camelToKebab = (camelCase: string) => {
  let result = camelCase
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2')
    .trim();

  return result.replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
}

export const parseRoleToCheckedStates = (userRole: string) => {
  // Assuming userRole is a string like '1001', convert it to an array of booleans
  return [...userRole].map(char => char === '1');
};



