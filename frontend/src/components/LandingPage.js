import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelectionModal from "./RoleSelectionModal";
import "./LandingPage.css"; // Add styles

const LandingPage = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState("");

    const handleOpenModal = (selectedAction) => {
        setAction(selectedAction);
        setShowModal(true);
    };

    const handleRoleSelect = (role) => {
        setShowModal(false);
        navigate(`/${action}?role=${role}`);
    };

    return (
        <div className="landing-container">
            <h1 className="title">AI-Powered Food Waste & Redistribution System</h1>
            <div className="button-container">
                <button onClick={() => handleOpenModal("register")}>Register</button>
                <button onClick={() => handleOpenModal("login")}>Sign In</button>
            </div>
            {showModal && <RoleSelectionModal onSelect={handleRoleSelect} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default LandingPage;
