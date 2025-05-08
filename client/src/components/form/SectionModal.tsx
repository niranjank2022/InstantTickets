import React, { useState, useEffect } from "react";
import { ISection } from "../../pages/AddVenue";

interface SectionModalProps {
  sections: ISection[];
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  venueRows: number;
  venueCols: number;
  editingSectionId: number | null;
  onClose: () => void;
}

const SectionModal: React.FC<SectionModalProps> = ({
  sections,
  setSections,
  venueRows,
  venueCols,
  editingSectionId,
  onClose,
}) => {
  const [form, setForm] = useState({
    name: "",
    rows: 2,
    columns: 2,
    x: 0,
    y: 0,
    price: 100,
    color: "#3B82F6",
  });
  const [overlapWarning, setOverlapWarning] = useState(false);
  const [overlappingSections, setOverlappingSections] = useState<ISection[]>(
    []
  );

  useEffect(() => {
    if (editingSectionId) {
      const section = sections.find((s) => s.id === editingSectionId);
      if (section) setForm(section);
    }
    checkOverlap();
  }, [editingSectionId, sections]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numFields = ["rows", "columns", "x", "y", "price"];
    const newValue = numFields.includes(name) ? +value || 0 : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    setTimeout(checkOverlap, 100);
  };

  const checkOverlap = () => {
    const overlaps = sections.filter((s) => {
      if (editingSectionId === s.id) return false;
      return !(
        form.x + form.columns <= s.x ||
        form.x >= s.x + s.columns ||
        form.y + form.rows <= s.y ||
        form.y >= s.y + s.rows
      );
    });
    setOverlappingSections(overlaps);
    setOverlapWarning(overlaps.length > 0);
  };

  const saveSection = () => {
    if (overlapWarning) {
      alert("Cannot save due to section overlap!");
      return;
    }
    if (
      form.name &&
      form.rows > 0 &&
      form.columns > 0 &&
      form.x + form.columns <= venueCols &&
      form.y + form.rows <= venueRows
    ) {
      setSections((prev) =>
        editingSectionId
          ? prev.map((s) =>
              s.id === editingSectionId ? { ...form, id: s.id } : s
            )
          : [...prev, { ...form, id: Date.now() }]
      );
      onClose();
    } else {
      alert("Invalid section details!");
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingSectionId ? "Edit Section" : "Add New Section"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {overlapWarning && (
              <div className="alert alert-danger mb-3">
                <strong>Section overlap detected!</strong> Overlaps with:
                <ul className="mb-0 mt-1">
                  {overlappingSections.map((s) => (
                    <li key={s.id}>
                      {s.name} (at {s.x}, {s.y})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="row mb-3">
              <div className="col-md-3 mb-3 mb-md-0">
                <label className="form-label small">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <label className="form-label small">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="form-control form-control-sm"
                />
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <label className="form-label small">Rows</label>
                <input
                  type="number"
                  name="rows"
                  value={form.rows}
                  onChange={handleInputChange}
                  min="1"
                  max={venueRows}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Columns</label>
                <input
                  type="number"
                  name="columns"
                  value={form.columns}
                  onChange={handleInputChange}
                  min="1"
                  max={venueCols}
                  className="form-control form-control-sm"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 mb-3 mb-md-0">
                <label className="form-label small">X Position</label>
                <input
                  type="number"
                  name="x"
                  value={form.x}
                  onChange={handleInputChange}
                  min="0"
                  max={Math.max(0, venueCols - form.columns)}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <label className="form-label small">Y Position</label>
                <input
                  type="number"
                  name="y"
                  value={form.y}
                  onChange={handleInputChange}
                  min="0"
                  max={Math.max(0, venueRows - form.rows)}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small">Color</label>
                <input
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={handleInputChange}
                  className="form-control p-0 border-0"
                  style={{
                    width: "30px",
                    height: "30px",
                    padding: "0",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small">Position Preview</label>
              <div className="bg-light p-3 rounded d-flex justify-content-center">
                <div
                  className="position-relative border border-secondary rounded"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${venueCols}, 20px)`,
                    gridTemplateRows: `repeat(${venueRows}, 20px)`,
                    gap: "1px",
                  }}
                >
                  {Array.from({ length: venueRows }).map((_, row) =>
                    Array.from({ length: venueCols }).map((_, col) => (
                      <div
                        key={`cell-${row}-${col}`}
                        className="border border-light bg-white"
                        style={{ width: "20px", height: "20px" }}
                      ></div>
                    ))
                  )}
                  {sections.map(
                    (s) =>
                      editingSectionId !== s.id && (
                        <div
                          key={s.id}
                          className="position-absolute rounded"
                          style={{
                            top: `${s.y * 21}px`,
                            left: `${s.x * 21}px`,
                            width: `${s.columns * 21 - 1}px`,
                            height: `${s.rows * 21 - 1}px`,
                            backgroundColor: s.color,
                            opacity: 0.5,
                            border: overlappingSections.some(
                              (o) => o.id === s.id
                            )
                              ? "2px solid red"
                              : "none",
                            zIndex: 5,
                          }}
                        >
                          <div
                            className="position-absolute text-dark bg-white bg-opacity-75 px-1 rounded"
                            style={{
                              fontSize: "0.65rem",
                              top: "1px",
                              left: "1px",
                            }}
                          >
                            {s.name}
                          </div>
                        </div>
                      )
                  )}
                  <div
                    className={`position-absolute rounded ${
                      overlapWarning ? "border border-danger border-2" : ""
                    }`}
                    style={{
                      top: `${form.y * 21}px`,
                      left: `${form.x * 21}px`,
                      width: `${form.columns * 21 - 1}px`,
                      height: `${form.rows * 21 - 1}px`,
                      backgroundColor: form.color,
                      opacity: 0.7,
                      zIndex: 10,
                    }}
                  >
                    <div
                      className="position-absolute text-dark bg-white bg-opacity-75 px-1 rounded"
                      style={{ fontSize: "0.65rem", top: "1px", left: "1px" }}
                    >
                      {form.name || "New Section"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveSection}
              className="btn btn-primary"
              disabled={overlapWarning}
            >
              {editingSectionId ? "Update" : "Add Section"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;
