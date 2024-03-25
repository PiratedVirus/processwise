'use client';
import PdfViewer from '@/app/ui/PdfViewer';



export default function HomePage() {
  // Specify the path to the PDF file
  const pdfFile = 'https://gl7crk93wzx1epaw.public.blob.vercel-storage.com/PO_M1_2324_124042-rpBY7jXOA8w0AtfAMjNoKMAsVUDbQl.pdf';

  const testHighlights = [
    {
        content: {
          text: " Type Checking for JavaScript",
        },
        position: {
          boundingRect: {
            x1: 255.73419189453125,
            y1: 139.140625,
            x2: 574.372314453125,
            y2: 165.140625,
            width: 809.9999999999999,
            height: 1200,
          },
          rects: [
            {
              x1: 255.73419189453125,
              y1: 139.140625,
              x2: 574.372314453125,
              y2: 165.140625,
              width: 809.9999999999999,
              height: 1200,
            },
          ],
          pageNumber: 1,
        },
        comment: {
          text: "Flow or TypeScript?",
          emoji: "🔥",
        },
        id: "8245652131754351",

  },
//   {
//     content: {
//       text: " millions of lines of code atFacebookevery day",
//     },
//     position: {
//       boundingRect: {
//         x1: 153.080810546875,
//         y1: 146.390625,
//         x2: 658.6533203125,
//         y2: 763.390625,
//         width: 2709.9999999999999,
//         height: 1200,
//       },
//       rects: [
//         {
//           x1: 353.080810546875,
//           y1: 346.390625,
//           x2: 658.6533203125,
//           y2: 363.390625,
//           width: 809.9999999999999,
//           height: 1200,
//         },
//       ],
//       pageNumber: 1,
//     },
//     comment: {
//       text: "impressive",
//       emoji: "",
//     },
//     id: "812807243318874",
//   },
];

  return (
    <div>
      <h1>PDF Viewer</h1>
      <PdfViewer url={pdfFile} initialHighlights={testHighlights}/>
    </div>
  );
}
