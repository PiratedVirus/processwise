import { useState, useEffect } from "react";
import { PdfLoader, PdfHighlighter, Tip, Highlight, Popup, AreaHighlight } from "react-pdf-highlighter";



const PdfHighlighterComponent = ({ url, initialHighlights }) => {
  const tempHigh = [
    {
      content: {
        text: " Type Checking for JavaScript",
      },
      color: 'green',
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
        text: "impressive",
      },
      id: "8245652131754351",

    },
    {
      content: {
        text: " millions of lines of code atFacebookevery day",
      },
      color: 'red',  
      position: {
        boundingRect: {
          x1: 353.080810546875,
          y1: 346.390625,
          x2: 658.6533203125,
          y2: 363.390625,
          width: 809.9999999999999,
          height: 1200,
        },
        rects: [
          {
            x1: 353.080810546875,
            y1: 346.390625,
            x2: 658.6533203125,
            y2: 363.390625,
            width: 809.9999999999999,
            height: 1200,
          },
        ],
        pageNumber: 2,
      },
      comment: {
        text: "impressive123",
      },
      id: "812807243318875",
    },
    {
      content: {
        text: " millions of lines of code atFacebookevery day",
      },
      color: 'red',  
      position: {
        boundingRect: {
          x1: 353.080810546875,
          y1: 346.390625,
          x2: 658.6533203125,
          y2: 363.390625,
          width: 809.9999999999999,
          height: 1200,
        },
        rects: [
          {
            x1: 353.080810546875,
            y1: 346.390625,
            x2: 658.6533203125,
            y2: 363.390625,
            width: 809.9999999999999,
            height: 1200,
          },
        ],
        pageNumber: 1,
      },
      comment: {
        text: "impressive",
      },
      id: "812807243318874",
    },

  ];

  const [highlights, setHighlights] = useState(tempHigh);

  const addHighlight = (highlight) => {
    console.log("Adding highlight", highlight);
    setHighlights([...highlights, highlight]);
  };

  const updateHighlight = (highlightId, position, content) => {
    console.log("Updating highlight", highlightId, position, content);
    setHighlights(highlights.map(h => h.id === highlightId ? { ...h, position, content } : h));
  };
  console.log('highlights:', highlights);
  const pdfHighlighterDiv = document.querySelector(".PdfHighlighter");

useEffect(() => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return;

      for (let i = 0; i < mutation.addedNodes.length; i++) {
        // Check if the added node is the PdfHighlighter div
        console.log('mutation.addedNodes[i]:', mutation.addedNodes[i]);
        if (mutation.addedNodes[i].classList.contains('canvasWrapper')) {
          console.log('PdfHighlighter div found');
          const pdfHighlighterDiv = document.querySelector(".PdfHighlighter");
          pdfHighlighterDiv.style.width = '40%';
          pdfHighlighterDiv.style.height = '90vh';
          console.log('pdfHighlighterDiv:', pdfHighlighterDiv);
          mutation.addedNodes[i].style.width = '40%';
          observer.disconnect(); // Stop observing after applying the style
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}, []);

  return (
    // Adjust the wrapper div to control the size and scrolling of the PDF viewer
    <div style={{ width: "100%",  overflow: "auto" }}>
      <PdfLoader url={url} beforeLoad={<div>Loading...</div>}>
        {(pdfDocument) => (
          <div style={{ width: "50%", overflow: "auto" }}>
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={() => { }}
              pdfScaleValue="page-width"
              scrollRef={(scrollTo) => { }}
              highlights={highlights}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment });
                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !Boolean(highlight.content && highlight.content.image);
                const highlightStyle = { background: highlight.color };
                const component = isTextHighlight ? (
                  <div style={highlightStyle}>
                    <Highlight isScrolledTo={isScrolledTo} {...highlight} />
                  </div>
                ) : (
                  <div style={highlightStyle}>
                    <AreaHighlight isScrolledTo={isScrolledTo} {...highlight} />
                  </div>
                );

                return (
                  <Popup
                    popupContent={<div>{highlight.comment.text}</div>}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, highlight => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
            />
          </div>
        )}
      </PdfLoader>
    </div>
  );
};

export default PdfHighlighterComponent;


