
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

    const initialContent = '';
    const initialMode = 'read';
    const role = user.role;
    const [pres, setPres] = useState([]);
    const [content, setContent] = useState(initialContent || '');
    const [mode, setMode] = useState(initialMode); // 'add' | 'edit' | 'read'
    const isDoctor = role === 'doctor';
    const isPatient = role === 'patient';

    const {id} = useParams();
    
    useEffect(() => {
        axios.get(`http://localhost:3000/prescriptions/${id}`)
        .then(response => {
            //TODO
            // console.warn(response.data);
            setPres(response.data);
        })
        .catch(error => {
            console.warn(error);
        });
    }, []);

    useEffect(() => { 
        if (id) {
                console.log(pres);
            setContent(pres.content);
            } if(!id) {
            setPres(
                setContent(initialContent)
            );
            }
    }, [pres.id]);


    const handleSave = () => {
        // TODO: Save content to backend or json-server
        console.log('Prescription saved:', content);
        setMode('read');
    };

    const handleCancel = () => {
        setContent(initialContent); // reset to original
        setMode('read');
    };

    return (
        <div className="container mt-4">
        <button className="btn mb-3" style={{ backgroundColor: "white", color: "#1A2D42" , border: "2px solid #1A2D42" }} onClick={() => navigate(-1)}>
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
                    style={{ backgroundColor: "#1A2D42", color: "White"}}
                    onClick={() => setMode(content ? 'edit' : 'add')}
                    >
                    Edit Prescription
                    </button>
                )}

                {mode === 'add' && (
                    <button className="btn" style={{ backgroundColor: "#1A2D42", color: "White"}} onClick={handleSave}>
                    Save Prescription
                    </button>
                )}

                {mode === 'edit' && (
                    <>
                    <button className="btn" style={{ backgroundColor: "#1A2D42", color: "White"}} onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn" style={{ backgroundColor: "white", color: "#1A2D42", border: "2px solid #1A2D42"}} onClick={handleSave}>
                        Save
                    </button>
                    </>
                )}
                </div>
            )}
            </div>

            <div className="card-footer text-muted text-end">
            Modified At: {pres.date}
            </div>
        </div>
        </div>
    );
    };

export default Prescription;
