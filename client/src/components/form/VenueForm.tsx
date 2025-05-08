import React from "react";

interface FormData {
  name: string;
  city: string;
  rows: number;
  columns: number;
  seatMap: boolean[][];
}

interface VenueFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  maxRowCol: number;
  cities: string[];
}

const VenueForm: React.FC<VenueFormProps> = ({
  formData,
  setFormData,
  maxRowCol,
  cities,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rows" || name === "columns"
          ? Math.min(maxRowCol, Math.max(1, +value))
          : value,
    }));
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Math.min(maxRowCol, Math.max(1, +value));
    setFormData((prev) => {
      const newRows = name === "rows" ? numValue : prev.rows;
      const newCols = name === "columns" ? numValue : prev.columns;
      const newSeatMap = Array(newRows)
        .fill(0)
        .map(() => Array(newCols).fill(true));
      for (let i = 0; i < Math.min(prev.seatMap.length, newRows); i++) {
        for (
          let j = 0;
          j < Math.min(prev.seatMap[i]?.length || 0, newCols);
          j++
        ) {
          newSeatMap[i][j] = prev.seatMap[i][j];
        }
      }
      return { ...prev, [name]: numValue, seatMap: newSeatMap };
    });
  };

  return (
    <>
      <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
        <label className="form-label">Venue Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-control"
          placeholder="Enter venue"
        />
      </div>
      <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
        <label className="form-label">City</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="form-select"
        >
          {cities.map((city) => (
            <option key={city.toLowerCase()} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
        <label className="form-label">Rows</label>
        <input
          type="number"
          name="rows"
          min="1"
          max={maxRowCol}
          value={formData.rows}
          onChange={handleDimensionChange}
          className="form-control"
        />
      </div>
      <div className="col-md-3 col-sm-6">
        <label className="form-label">Columns</label>
        <input
          type="number"
          name="columns"
          min="1"
          max={maxRowCol}
          value={formData.columns}
          onChange={handleDimensionChange}
          className="form-control"
        />
      </div>
    </>
  );
};

export default VenueForm;
