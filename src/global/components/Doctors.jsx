import React from "react";
import "./Doctors.css";
import DoctorCard from "../components/DoctorCard";
import EditDoctorModal from "../components/Admin/EditDoctorModal";
import AddDoctorForm from "../components/Admin/AddDocForm";
import { Plus } from "lucide-react";

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
    };
  }



  
  componentDidMount() {
    this.fetchDoctors();
  }

  fetchDoctors = async () => {
    try {
      this.setState({ isLoading: true, error: null });
      const response = await fetch("http://localhost:3000/doctors");
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

        const response = await fetch("http://localhost:3000/doctors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDoctor),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add doctor");
        }
  
        const addedDoctor = await response.json();
  
        this.setState((prevState) => ({
          doctors: [...prevState.doctors, addedDoctor],
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
  handleDeleteDoctor = async (id) => {
    try {
      this.setState({ isLoading: true });
      this.setState((prevState) => ({
        doctors: prevState.doctors.filter((doctor) => doctor.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      this.setState({
        error: "Failed to delete doctor",
        isLoading: false,
      });
    }
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={this.fetchDoctors} className="retry-btn">
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="doctors-page">
        <h1 className="page-title">Doctors Management</h1>

        {role === "admin" && (
          <button onClick={this.handleOpenAddForm} className="add-doctor-btn">
            <Plus size={18} />
            <span>Add Doctor</span>
          </button>
        )}

        <div className="doctors-grid">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onDelete={this.handleDeleteDoctor}
                onEdit={this.handleEditDoctor}
              />
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
    );
  }
}

export default DoctorsPage;
