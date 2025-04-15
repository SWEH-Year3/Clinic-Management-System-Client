import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "./../../Context/AuthContext";
import axios from 'axios';

const Prescription = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams();

    const role = user.role;
    const isDoctor = role === 'doctor';
    const isPatient = role === 'patient';

    const [pres, setPres] = useState(null);
    const [content, setContent] = useState('');
    const [mode, setMode] = useState('read'); // 'add' | 'edit' | 'read'
    const [initialContent, setInitialContent] = useState('');

    // Load prescription
    useEffect(() => {
        if (!id) return;

        axios.get(`http://localhost:3000/prescriptions/${id}`)
        .then((response) => {
            setPres(response.data);
            setContent(response.data.content || '');
            setInitialContent(response.data.content || '');
        })
        .catch((error) => {
            console.warn('Error loading prescription:', error);
        });
    }, [id]);

    const handleSave = () => {
        const updatedPrescription = {
        ...pres,
        content: content,
        date: new Date().toISOString().split('T')[0],
        };

        axios.put(`http://localhost:3000/prescriptions/${id}`, updatedPrescription)
        .then((response) => {
            console.log('Prescription saved:', response.data);
            setPres(response.data);
            setInitialContent(response.data.content || '');
            setMode('read');
        })
        .catch((error) => {
            console.warn('Error saving prescription:', error);
        });
    };

    const handleCancel = () => {
        setContent(initialContent);
        setMode('read');
    };

    return (
        <div className="container mt-4">
        <button
            className="btn mb-3"
            style={{ backgroundColor: "white", color: "#1A2D42", border: "2px solid #1A2D42" }}
            onClick={() => navigate(-1)}
        >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back
        </button>

        <div className="card shadow-sm">
            <div className="card-body bg-light">
            {(mode === 'read' || isPatient) && (
                <div
                className="border p-3 bg-white"
                dangerouslySetInnerHTML={{ __html: content || '<i>No prescription yet.</i>' }}
                />
            )}

            {(mode === 'add' || mode === 'edit') && isDoctor && (
                <ReactQuill
                value={content}
                onChange={setContent}
                placeholder="Prescription appears here..."
                className="bg-white"
                />
            )}

            {isDoctor && (
                <div className="mt-3 d-flex justify-content-center gap-2">
                {mode === 'read' && (
                    <button
                    className="btn"
                    style={{ backgroundColor: "#1A2D42", color: "white" }}
                    onClick={() => setMode(content ? 'edit' : 'add')}
                    >
                    Edit Prescription
                    </button>
                )}

                {mode === 'add' && (
                    <button
                    className="btn"
                    style={{ backgroundColor: "#1A2D42", color: "white" }}
                    onClick={handleSave}
                    >
                    Save Prescription
                    </button>
                )}

                {mode === 'edit' && (
                    <>
                    <button
                        className="btn"
                        style={{ backgroundColor: "#1A2D42", color: "white" }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn"
                        style={{ backgroundColor: "white", color: "#1A2D42", border: "2px solid #1A2D42" }}
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    </>
                )}
                </div>
            )}
            </div>

            <div className="card-footer text-muted text-end">
            Modified At: {pres?.date}
            </div>
        </div>
        </div>
    );
    };

export default Prescription;
