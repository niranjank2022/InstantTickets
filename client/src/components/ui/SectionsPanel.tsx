import React from "react";
import { ISection } from "../../pages/AddVenue";

interface SectionsPanelProps {
  sections: ISection[];
  onAdd: () => void;
  onEdit: (section: ISection) => void;
  onRemove: React.Dispatch<React.SetStateAction<ISection[]>>;
}

const SectionsPanel: React.FC<SectionsPanelProps> = ({
  sections,
  onAdd,
  onEdit,
  onRemove,
}) => {
  return (
    <div className="col-md-4 mb-4 mb-md-0">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="h5 mb-0">Sections</h3>
        <button
          type="button"
          onClick={onAdd}
          className="btn btn-primary btn-sm"
        >
          Add Section
        </button>
      </div>
      <div className="overflow-auto pe-1 mb-4" style={{ maxHeight: "24rem" }}>
        {sections.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className="d-flex align-items-center justify-content-between p-2 rounded border bg-light small"
                style={{ borderColor: section.color }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-1 me-2"
                    style={{
                      backgroundColor: section.color,
                      width: "0.75rem",
                      height: "0.75rem",
                    }}
                  ></div>
                  <div>
                    <span className="fw-medium">{section.name}</span>
                    <span className="text-muted ms-1 small">
                      ₹{section.price.toFixed(2)}
                    </span>
                    <div className="text-muted small">
                      ({section.x}, {section.y}) • {section.rows}×
                      {section.columns}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(section)}
                    className="btn btn-link btn-sm p-0 text-primary small"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onRemove((prev) =>
                        prev.filter((s) => s.id !== section.id)
                      )
                    }
                    className="btn btn-link btn-sm p-0 text-danger small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted text-center py-4 bg-light rounded small">
            No sections added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionsPanel;
