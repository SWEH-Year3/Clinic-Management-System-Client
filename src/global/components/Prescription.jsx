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
    const [loader, setLoader] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [content, setContent] = useState('');
    const [mode, setMode] = useState('read'); // 'add' | 'edit' | 'read'
    const [initialContent, setInitialContent] = useState('');

    // Load prescription
    useEffect(() => {
        if (!id) return;

        axios.get(`https://localhost:7195/api/Prescription/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then((response) => {
                if (response.data.description == "" || response.data.description == null) {
                    setIsNew(true);
                } else {
                    setIsNew(false);
                }
                setPres(response.data);
                setContent(response.data.description || '');
                setInitialContent(response.data.description || '');

            })
            .catch((error) => {
                setIsNew(true);
                console.warn('Error loading prescription:', error);
            });
    }, [id]);

    const handleSave = () => {
        setLoader(true);
        const updatedPrescription = {
            id: pres?.id,
            description: content,
            modification_date: new Date().toLocaleString(),
            appointmentId: id
        };
        switch (isNew) {
            case true:
                axios.post('https://localhost:7195/api/Prescription', updatedPrescription, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                    .then((response) => {
                        console.log('Prescription saved:', response.data);
                        setPres(updatedPrescription);
                        setInitialContent(updatedPrescription.description || '');
                        setMode('read');
                    })
                    .catch((error) => {
                        console.warn('Error saving prescription:', error);
                    }).finally(() => {
                        setLoader(false);
                    });
                break;
            case false:
                axios.put(`https://localhost:7195/api/Prescription/${id}`, updatedPrescription, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                    .then((response) => {
                        console.log('Prescription saved:', response.data);
                        setPres(updatedPrescription);
                        setInitialContent(updatedPrescription.description || '');
                        setMode('read');
                    })
                    .catch((error) => {
                        console.warn('Error saving prescription:', error);
                    }).finally(() => {
                        setLoader(false);
                    });
                break;
        }
        // axios.put(`https://localhost:7195/api/Prescription/${id}`, updatedPrescription, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${user.token}`
        //     }
        // })
        // .then((response) => {
        //     console.log('Prescription saved:', response.data);
        //     setPres(response.data);
        //     setInitialContent(response.data.description || '');
        //     setMode('read');
        // })
        // .catch((error) => {
        //     console.warn('Error saving prescription:', error);
        // });
    };
    const downloadPrescription = () => {
        axios.get(`https://localhost:7195/api/Prescription/${id}/pdf`)
            .then((response) => {
                const filePath = response.data.filePath; // e.g., /Files/Prescription_abc.pdf
                    axios.get(filePath, {
                        responseType: 'blob'
                    })
                    .then(response => {
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const url = window.URL.createObjectURL(blob);

                        // Trigger the download
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'prescription.pdf';
                        a.click();
                        window.URL.revokeObjectURL(url); // clean up
                    })
            })
            .catch((error) => {
                console.error('Download failed:', error);
            });
    };


    const handleCancel = () => {
        setContent(initialContent);
        setMode('read');
    };
    // console.log(pres)
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
                    {isPatient && (
                        <div className="mt-3 d-flex justify-content-center gap-2">
                            {mode === 'read' && (
                                <button
                                    className="btn"
                                    style={{ backgroundColor: "#1A2D42", color: "white", cursor: !content ? 'not-allowed' : 'pointer' }}
                                    onClick={downloadPrescription}
                                    disabled={!content}

                                >
                                    Download Prescription
                                </button>
                            )}</div>
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
                                    {loader ? (
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) :
                                        ("Save Prescription")
                                    }
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

                                        {loader ? (
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) :
                                            ("Save")
                                        }
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="card-footer text-muted text-end">
                    Modified At: {pres?.modification_date}
                </div>
            </div>
        </div>
    );
};

export default Prescription;
