import React from "react";
import "./RoleSelectionModal.css"; // Add styles

const RoleSelectionModal = ({ onSelect, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Select Your Role</h2>
                <button onClick={() => onSelect("donor")}>Donor</button>
                <button onClick={() => onSelect("ngo")}>NGO</button>
                <button onClick={() => onSelect("individual")}>Individual</button>
                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
