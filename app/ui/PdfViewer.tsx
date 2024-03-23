'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set workerSrc to specify the location of the pdf.worker.js file
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const PdfViewer = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1); // Add state to track the current page

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Function to go to the next page
  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => prevPageNumber < numPages ? prevPageNumber + 1 : prevPageNumber);
  };

  // Function to go to the previous page
  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => prevPageNumber > 1 ? prevPageNumber - 1 : prevPageNumber);
  };

  return (
    <div>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{
          cMapUrl: 'cmaps/',
          cMapPacked: true,
        }}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        {/* Navigation controls */}
        <button onClick={goToPrevPage} disabled={pageNumber === 1}>
          Previous
        </button>
        <span>Page {pageNumber} of {numPages}</span>
        <button onClick={goToNextPage} disabled={pageNumber === numPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
