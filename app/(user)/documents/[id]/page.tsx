// app/page/index.tsx'
'use client';
import PdfViewer from '@/app/ui/PdfViewer';

export default function HomePage() {
  // Specify the path to the PDF file
  const pdfFile = 'https://gl7crk93wzx1epaw.public.blob.vercel-storage.com/PO_M1_2324_124042-rpBY7jXOA8w0AtfAMjNoKMAsVUDbQl.pdf';

  return (
    <div>
      <h1>PDF Viewer</h1>
      <PdfViewer file={pdfFile} />
    </div>
  );
}
