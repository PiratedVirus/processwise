

export const camelToKebab = (camelCase: string) => {
  let result = camelCase
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2')
    .trim();

  return result.replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
}

export const arrayToString = (arr: string[]) => {
  return arr.join(", ");
};

export const parseRoleToCheckedStates = (userRole: string) => {
  return [...userRole].map(char => char === '1');
};
export const parseRoleToBinary = (selectedRoles: string[]) => {
  const allRoles = ["Processing", "Approving", "Reporting", "Admin"];
  let binary = '';

  allRoles.forEach((role) => {
    binary += selectedRoles.includes(role) ? '1' : '0';
  });

  return binary;
};

export const parseBinaryToRoles = (binary: string) => {
  const allRoles = ["Processing", "Approving", "Reporting", "Admin"];
  let selectedRoles: string[] = [];

  binary.split('').forEach((bit, index) => {
    if (bit === '1') {
      selectedRoles.push(allRoles[index]);
    }
  });

  return selectedRoles;
};



