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

type ColorPair = {
  backgroundColor: string;
  borderColor: string;
};
import { parse } from 'json2csv';
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

export const capitalizeAndConvert = (input: string): string =>  {
  // Replace hyphens with spaces and convert to lower case
  let str = input.replace(/-/g, ' ').toLowerCase();

  // Capitalize the first letter of each word
  str = str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
  });

  return str;
}

export const transformDataForCsv = (data: any): any[] => {
  const rows: { [key: string]: any } = {};

  Object.entries(data).forEach(([key, value]) => {
    rows[key] = (value as any).valueString; // Type assertion to specify the type of 'value' as 'any'
  });

  return [rows]; // Wrap the result in an array because parse function expects an array
}
export const transformItemsForCsv = (data: any): any[] => {
  const rows: { [key: string]: any } = {};

  Object.entries(data).forEach(([key, value]) => {
    const [_, rowKey, field] = key.split('-'); // Extract row number and field name
    if (!rows[rowKey]) {
      rows[rowKey] = {};
    }
    rows[rowKey][field] = (value as any).valueString ?? (value as any).valueNumber ?? ""; // Handle both string and number values
  });

  return Object.values(rows);
}
export const generateCsv = (data: any): void => {
  const transformedItemsData = transformItemsForCsv(data.mailDataWithConvertedItems);
  const transformedDetailsData = transformDataForCsv(data.mailDataWithoutItems);
  const csvData = transformedDetailsData.map((item, i) => {
    return {...item, ...transformedItemsData[i]};
  });
  
  
  try {
    const csv = parse(csvData);
    console.log(csv);

    // Create a Blob from the CSV data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');

    // Set the href and download attributes of the link
    link.href = url;
    link.download = 'output.csv';

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  } catch (err) {
    console.error('Could not generate CSV:', err);
  }
}

export const darkenColor = (color: string, amount: number): string => {
  let [r, g, b] = color.match(/\w\w/g)!.map((c) => parseInt(c, 16));
  return (
      "#" +
      [r, g, b]
          .map((c) => Math.max(0, Math.min(255, c - amount)).toString(16).padStart(2, "0"))
          .join("")
  );
}

export const getConfidenceColor = (confidence: number): ColorPair => {
  const colors = {
      red: '#FF8A65',
      green: '#C8E6C9',
      yellow: '#FFECB3',
      orange: '#FFE0B2',
  };

  let color;
  if (confidence >= 0.7) {
      color = colors.green;
  } else if (confidence >= 0.4) {
      color = colors.yellow;
  } else {
      color = colors.orange;
  }

  const borderColor = darkenColor(color, 30); // Adjust the amount to get the desired darkness

  return {
      backgroundColor: color,
      borderColor: borderColor,
  };
};

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

export const transformCoordinatesToHighlight = (coordinatesObject: any, id: string): HighlightObject => {
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

export const transformCoordinatesToHighlightAlt = (sampleObject: any, idPrefix: string): HighlightObject[] => {
  // console.log("HIGH SAMPLE OBJ Returning ", sampleObject);
  const highlights: HighlightObject[] = [];

  // Helper function to transform a single coordinate object
  const highlightHelper = (coordinatesObject: any, id: string): HighlightObject => {
    const { valueString: text, boundingRegions } = coordinatesObject;
    const { pageNumber, polygon } = boundingRegions[0];
    const x1 = Math.min(polygon[0], polygon[2], polygon[4], polygon[6]);
    const y1 = Math.min(polygon[1], polygon[3], polygon[5], polygon[7]);
    const x2 = Math.max(polygon[0], polygon[2], polygon[4], polygon[6]);
    const y2 = Math.max(polygon[1], polygon[3], polygon[5], polygon[7]);
    const width = 1123;
    const height = 849;
    return {
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
      comment: { text },
      id,
    };
  };

  // Process the "Items" key if it exists
  if (sampleObject.Items) {
    console.log("HIGH Processing Items");
    sampleObject.Items.valueArray.forEach((item: any, index: number) => {
      Object.entries(item.valueObject).forEach(([key, coordinatesObject]) => {
        const highlight = highlightHelper(coordinatesObject, `${idPrefix}-${index}-${key}`);
  
        highlights.push(highlight);
      });
    });
  }
  
  // Process other keys outside of "Items"
  Object.entries(sampleObject).forEach(([key, value]) => {
    console.log("HIGH Processing " + key);
  
    if (key !== "Items" && (value as any).boundingRegions) {
      const highlight = highlightHelper(value, `${key}`);
      console.log("OBJ SINGLR Returning high", highlight);
      highlights.push(highlight);
    } 
  });
  console.log("OBJ Returning high", highlights);
  return highlights;
};




