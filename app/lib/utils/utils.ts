

export const camelToKebab = (camelCase: string) => {
  let result = camelCase
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2')
    .trim();

  return result.replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
}

export const camelToTitleCase = (str: string): string =>{
  return str
    .replace(/([A-Z])/g, ' $1') // insert a space before all capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize the first letter
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

type CoOrdinatesObject = {
  valueString: string;
  boundingRegions: {
    pageNumber: number;
    polygon: number[];
  }[];
};

type HighlightObject = {
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
    rects: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
    }[];
    pageNumber: number;
  };
  comment: {
    text: string;
  };
  id: string;
};

export const transformCoordinatesToHighlight = (coordinatesObject: CoOrdinatesObject, id: string): HighlightObject => {
  // Extract the necessary information
  const { valueString: text, boundingRegions } = coordinatesObject;
  const { pageNumber, polygon } = boundingRegions[0];

  // Calculate the bounding rectangle and dimensions from the polygon
  const x1 = Math.min(polygon[0], polygon[2], polygon[4], polygon[6]);
  const y1 = Math.min(polygon[1], polygon[3], polygon[5], polygon[7]);
  const x2 = Math.max(polygon[0], polygon[2], polygon[4], polygon[6]);
  const y2 = Math.max(polygon[1], polygon[3], polygon[5], polygon[7]);
  const width = 1123;
  const height = 849;

  // Prepare the highlight object
  const highlightObject: HighlightObject = {
    position: {
      boundingRect: {
        x1: x1 * 100, // Adjust scaling here if necessary
        y1: y1 * 100, // Adjust scaling here if necessary
        x2: x2 * 100, // Adjust scaling here if necessary
        y2: y2 * 100, // Adjust scaling here if necessary
      },
      rects: [
        {
          x1: x1 * 100, // Adjust scaling here if necessary
          y1: y1 * 100, // Adjust scaling here if necessary
          x2: x2 * 100, // Adjust scaling here if necessary
          y2: y2 * 100, // Adjust scaling here if necessary
          width: width, // Adjust scaling here if necessary
          height: height, // Adjust scaling here if necessary
        },
      ],
      pageNumber,
    },
    comment: {
      text,
    },
    id,
  };

  return highlightObject;
}



