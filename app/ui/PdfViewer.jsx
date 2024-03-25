import { useState, useEffect } from "react";
import { PdfLoader, PdfHighlighter, Tip, Highlight, Popup, AreaHighlight } from "react-pdf-highlighter";
import { transformCoordinatesToHighlight } from "@/app/lib/utils/utils";

const PdfViewer = ({ url, initialHighlights, visibilityStates }) => {
  // console.log("PdfViewer", url, initialHighlights, visibilityStates);

  let highlightsArray = Object.keys(initialHighlights).map(key => {
    const highlightId = key; // Using the key as ID for simplicity
    return transformCoordinatesToHighlight(initialHighlights[key], highlightId);
  });

  const [highlights, setHighlights] = useState(highlightsArray);

  const visibleHighlights = Object.keys(initialHighlights)
    .filter(key => visibilityStates[key])
    .map(key => {
      // Assuming transformCoordinatesToHighlight returns the highlight object structured for PdfHighlighter
      const highlightId = key; // Using the key as an ID for simplicity
      return {
        ...transformCoordinatesToHighlight(initialHighlights[key], highlightId),
        id: highlightId, // Ensure each highlight object has an 'id' field
      };
    });
    console.log("visibleHighlights", visibleHighlights);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;
  
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].classList.contains('canvasWrapper')) {
            const pdfHighlighterDiv = document.querySelector(".PdfHighlighter");
            pdfHighlighterDiv.style.width = '40%';
            observer.disconnect(); 
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
    <div style={{ width: "100%", overflow: "auto" }}>

      <PdfLoader url={url} beforeLoad={<div>Loading...</div>}>
        {pdfDocument => (
          <div style={{ width: "50%", overflow: "auto" }}>
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={event => event.altKey}
              onScrollChange={() => {}}
              pdfScaleValue="page-width"
              scrollRef={scrollTo => {}}
              highlights={visibleHighlights}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={comment => {
                    const newHighlight = { content, position, comment, id: Math.random().toString() };
                    setHighlights(prevHighlights => [...prevHighlights, newHighlight]);
                    // Ensure the new highlight is visible
                    setVisibilityStates(prevStates => ({
                      ...prevStates,
                      [newHighlight.id]: true
                    }));
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
                const highlightStyle = { background: highlight.color };
                const component = (
                  <div style={highlightStyle}>
                    <Highlight isScrolledTo={isScrolledTo} {...highlight} />
                  </div>
                );

                return (
                  <Popup
                    popupContent={<div>{highlight.comment.text}</div>}
                    onMouseOver={popupContent => setTip(highlight, () => popupContent)}
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

export default PdfViewer;
