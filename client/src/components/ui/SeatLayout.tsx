import React, { useState } from "react";
import { FormData, ISection } from "../../pages/AddVenue";

interface SeatLayoutProps {
  formData: FormData;
  sections: ISection[];
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ formData, sections }) => {
  const [hoverInfo, setHoverInfo] = useState<{
    section: ISection;
    row: number;
    col: number;
  } | null>(null);

  const getSeatSection = (row: number, col: number) =>
    sections.find(
      (s) =>
        row >= s.y && row < s.y + s.rows && col >= s.x && col < s.x + s.columns
    );

  return (
    <div className="col-md-8">
      <h3 className="h5 mb-2">Seat Layout</h3>
      <div className="bg-light p-4 rounded overflow-auto">
        <div className="d-flex justify-content-center mb-4">
          <div className="bg-secondary px-5 py-1 rounded-top text-center fw-bold text-white small">
            SCREEN
          </div>
        </div>
        <div className="d-flex justify-content-center mb-4">
          <div
            className="d-flex flex-column align-items-center position-relative"
            style={{ gap: "0.25rem" }}
          >
            {formData.seatMap.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="d-flex"
                style={{ gap: "0.25rem" }}
              >
                {row.map((isAvailable, colIndex) => {
                  const section = getSeatSection(rowIndex, colIndex);
                  return (
                    <button
                      key={`seat-${rowIndex}-${colIndex}`}
                      type="button"
                      onMouseOver={() =>
                        section &&
                        setHoverInfo({ section, row: rowIndex, col: colIndex })
                      }
                      onMouseOut={() => setHoverInfo(null)}
                      className={`btn btn-sm d-flex align-items-center justify-content-center small rounded p-0 ${
                        isAvailable
                          ? section
                            ? "text-dark"
                            : "btn-light"
                          : "btn-secondary"
                      }`}
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        backgroundColor:
                          section && isAvailable ? section.color : undefined,
                      }}
                    >
                      {String.fromCharCode(65 + rowIndex)}
                      {colIndex + 1}
                    </button>
                  );
                })}
              </div>
            ))}
            {hoverInfo && (
              <div
                className="position-absolute bg-white p-2 rounded shadow-sm border small"
                style={{
                  top: `${hoverInfo.row * 28 + 30}px`,
                  left: `${hoverInfo.col * 28 + 30}px`,
                  zIndex: 10,
                }}
              >
                <div className="fw-bold">{hoverInfo.section.name}</div>
                <div>Price: ₹ {hoverInfo.section.price.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
        {sections.length > 0 && (
          <div className="d-flex flex-wrap gap-2 justify-content-center mt-2 small">
            {sections.map((section) => (
              <div key={section.id} className="d-flex align-items-center">
                <div
                  className="rounded-1 me-1"
                  style={{
                    backgroundColor: section.color,
                    width: "0.75rem",
                    height: "0.75rem",
                  }}
                ></div>
                <span>{section.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;
