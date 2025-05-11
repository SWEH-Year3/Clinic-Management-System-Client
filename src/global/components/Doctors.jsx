/* eslint-disable no-unused-vars */
import React from "react";
import "./Doctors.css";
import DoctorCard from "../components/DoctorCard";
import EditDoctorModal from "../components/Admin/EditDoctorModal";
import AddDoctorForm from "../components/Admin/AddDocForm";
import { ChevronsRightLeft, Plus } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";

class DoctorsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      isEditModalOpen: false,
      currentDoctor: null,
      isAddFormOpen: false,
      isLoading: true,
      error: null,
      searchTerm: '',
      
    };
  }



  
    componentDidMount() {
      const t = setTimeout(() => {
        this.fetchDoctors();
      }, 1000);
      return () => clearTimeout(t);
    }
    componentWillUnmount() {
      this.setState({
        doctors: [],
        isEditModalOpen: false,
        currentDoctor: null,
        isAddFormOpen: false,
        isLoading: true,
        error: null,
      });
    }
    // componentDidUpdate() {
    //   this.fetchDoctors();
    // }

  fetchDoctors = async () => {
    try {
      this.setState({ isLoading: true, error: null });
    //   const response = await fetch("http://localhost:3000/doctors");
    const response = await fetch("https://localhost:7195/api/Doctor");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors data");
      }
        await response.json().then((v) => {
            // console.log(v);
            this.setState({
              doctors: v || [],
              isLoading: false,
            });
        });
        
    } catch (error) {
      this.setState({
        error: error.message,
        isLoading: false,
      });
    }
  };

  handleOpenAddForm = () => {
    this.setState({ isAddFormOpen: true });
  };

  handleCloseAddForm = () => {
    this.setState({ isAddFormOpen: false });
  };

    // TO-DO: Post data to json-server endpoint -------> DONE
    handleAddDoctor = async (newDoctor) => {
      try {
        this.setState({ isLoading: true });
        console.log(newDoctor);
        const response = await fetch("https://localhost:7195/api/Doctor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`,
          },
          body: JSON.stringify({
            name: newDoctor.name,
            specialty: newDoctor.specialty,
            price: newDoctor.price,
            phone: newDoctor.phone
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add doctor");
          }

          toast.success("Doctor added successfully");
          const data = await response.json();
          toast.success(`
            email: ${data.email}
            password: ${data.password}
            `, {
              autoClose: 10000, style: { scale: 1.2 }, onClick: () => {
                navigator.clipboard.writeText(`
                email: ${data.email},
                password: ${data.password}
                `);
            }});
            console.log(data);
          // const addedDoctor = await response.json();
          const response2 = await fetch("https://localhost:7195/api/Doctor");
          if (!response2.ok) {
              throw new Error("Failed to fetch doctors data");
          }
          const addedDoctor = await response2.json()
  
        this.setState((prevState) => ({
        //   doctors: [...prevState.doctors, addedDoctor],
            doctors: addedDoctor,
          isAddFormOpen: false,
          isLoading: false,
        }));
      } catch (error) {
        this.setState({
          error: error.message,
          isLoading: false,
        });
      }
    };
  handleDeleteDoctor = async (docid) => {
      try {
        //   console.log(JSON.parse(localStorage.getItem("user")).token);
          await axios.delete(`https://localhost:7195/api/Doctor/${docid}`,
              {
                  headers: {
                      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                  }
              }
          );
          toast.success("Doctor deleted successfully");
          
      this.setState({ isLoading: true });
    //   this.setState((prevState) => ({
    //     // doctors: prevState.doctors.filter((doctor) => doctor.id !== id),
    //     isLoading: false,
    //   }));
      } catch (error) {
        toast.error("Failed to delete doctor");
      this.setState({
        error: "Failed to delete doctor",
        isLoading: false,
      });
      };
      this.setState((prevState) => ({
        isLoading: false,
      }));
  };

  handleEditDoctor = (doctor) => {
    this.setState({
      isEditModalOpen: true,
      currentDoctor: doctor,
    });
  };

  handleCloseModal = () => {
    this.setState({
      isEditModalOpen: false,
      currentDoctor: null,
    });
  };

  handleSaveDoctor = async (updatedDoctor) => {
    try {
      this.setState({ isLoading: true });
      this.setState((prevState) => ({
        doctors: prevState.doctors.map((doctor) =>
          doctor.id === updatedDoctor.id ? updatedDoctor : doctor
        ),
        isEditModalOpen: false,
        currentDoctor: null,
        isLoading: false,
      }));
    } catch (error) {
      this.setState({
        error: "Failed to update doctor",
        isLoading: false,
      });
    }
  };

  render() {
    const {
      doctors,
      isAddFormOpen,
      isLoading,
      error,
    } = this.state;

    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role;

    if (isLoading) {
        return (
          <div className="container d-flex justify-content-center align-items-center m-3 w-100 vh-100">
            <ToastContainer position="top-center" />
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
          </div>
      );
    }

    if (error) {
      return (
          <div className="error-container">

        <ToastContainer position="top-center" />
          <p>{error}</p>
          <button onClick={this.fetchDoctors} className="retry-btn">
            Retry
          </button>
        </div>
      );
    }
      const handleSearch = async (event) => {
        // console.log(event.target.value);
          event.preventDefault();
          try {
            
            //   const response = await fetch("http://localhost:3000/doctors");
            const response = await fetch(`https://localhost:7195/api/Doctor/search?Name=${event.target.value}`);
            if (response.ok) {
                await response.json().then((v) => {
                    // console.log(v);
                    this.setState({
                        doctors: v || [],
                        isLoading: false,
                    });
                });
            }else {
                await axios.get("https://localhost:7195/api/Doctor").then((v) => {
                    // console.log(v);
                    this.setState({
                        doctors: v.data || [],
                        isLoading: false,
                    });
                });
            }

        } catch (error) {
            this.fetchDoctors();
        }
      }
      return (
        <>
        
            <ToastContainer position="top-center" />
            
                <div className="doctors-page">
                <div>
                    <h1 className="page-title">Doctors Management</h1>
                    {role === "admin" && (
                        <button onClick={this.handleOpenAddForm} className="add-doctor-btn">
                            <Plus size={18} />
                            <span>Add Doctor</span>
                        </button>
                    )}
                      <div className="container-fluid w-50">
                          <form className="d-flex" role="search" onChange={handleSearch}>
                              <input className="form-control me-2" type="search"  placeholder="Search By Doctor Name" aria-label="Search" list="doctors"/>
                              {/* <button className="btn btn-outline-primary" type="submit">Search</button> */}
                              <datalist id="doctors">
                                  {doctors.map((doctor) => (
                                      <option key={doctor.doctorId} value={doctor.name} />
                                  ))}
                              </datalist>
                          </form>
                      </div>
                </div>
                <div className="doctors-grid">
                {doctors.length > 0 ? (
                    doctors.map((doctor, i) => (
                    <div key={i}>
                        <DoctorCard
                        keyID={i+doctor.doctorId}
                        doctor={doctor}
                        onDelete={this.handleDeleteDoctor}
                        onEdit={this.handleEditDoctor}
                        />
                    </div>    
                    ))
                ) : (
                    <div className="no-doctors">No doctors found</div>
                )}
                </div>


                <AddDoctorForm
                isOpen={isAddFormOpen}
                onClose={this.handleCloseAddForm}
                onAdd={this.handleAddDoctor}
                />

            </div>
        </>
    );
  }
}

export default DoctorsPage;
