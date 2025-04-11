import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueForm from "../components/form/VenueForm";
import SeatLayout from "../components/ui/SeatLayout";
import SectionsPanel from "../components/ui/SectionsPanel";
import SectionModal from "../components/form/SectionModal";
import AdminApis from "../services/theatreAdmin.api";

export interface FormData {
  name: string;
  city: string;
  rows: number;
  columns: number;
  seatMap: boolean[][];
}

export interface ISection {
  id: number;
  name: string;
  rows: number;
  columns: number;
  x: number;
  y: number;
  price: number;
  color: string;
}

const MAX_ROW_COL = 18;
const CITIES = [
  "Chennai",
  "Bangalore",
  "Mumbai",
  "New Delhi",
  "Hyderabad",
  "Kolkata",
  "Kochi",
];

const AddVenueWithSectionsModal: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    city: "Chennai",
    rows: 8,
    columns: 10,
    seatMap: Array(8)
      .fill(0)
      .map(() => Array(10).fill(true)),
  });
  const [sections, setSections] = useState<ISection[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);

  const handleSubmit = async () => {
    try {
      const res = await AdminApis.addVenue({ ...formData, sections });
      alert(res.data.message);
      navigate("/admin/dashboard/venues/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message);
      } else {
        alert("Unknown error occurred");
      }
    }
  };

  const openSectionModal = (section?: ISection) => {
    setEditingSectionId(section?.id ?? null);
    setModalOpen(true);
  };

  return (
    <div className="bg-light p-4 rounded container-fluid">
      <h1 className="h2 mb-4 text-dark">Add New Venue</h1>
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="row mb-4">
          <VenueForm
            formData={formData}
            setFormData={setFormData}
            maxRowCol={MAX_ROW_COL}
            cities={CITIES}
          />
        </div>
        <div className="row">
          <SectionsPanel
            sections={sections}
            onAdd={openSectionModal}
            onEdit={openSectionModal}
            onRemove={setSections}
          />
          <SeatLayout formData={formData} sections={sections} />
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Add Venue
          </button>
        </div>
      </div>
      {modalOpen && (
        <SectionModal
          sections={sections}
          setSections={setSections}
          venueRows={formData.rows}
          venueCols={formData.columns}
          editingSectionId={editingSectionId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AddVenueWithSectionsModal;
