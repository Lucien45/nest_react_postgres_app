import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { UserService } from '../_services/Users.service';
import { Utils } from '../_utils/Utils';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

interface Users {
  id: number;
  name: string;
  username: string;
  email: string ;
  age: number;
  password: string;
  gender : string;
}

interface DetailsProps {
  id: string;
  onClose: () => void;
}

export const ListUsers: React.FC = () => {
  const [dataUsers, setDataUsers] = useState<Users[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(25);

  const GetAllUsers = async () => {
    try {
      const res = await UserService.getAllUsers();
      setDataUsers(res.data);
    } catch (error) {
      Utils.errorPage(`Échec de recuperation ${error}`);
      console.error(error);
    }
  };

  const deleteUser = async (id: number) => {
    Utils.confirmMessage(
      `Êtes-vous sûr de vouloir supprimer ce club?`,
      async () => {
        try {
          const res = await UserService.deleteUser(id);
          if (res.status === 200) {
            Utils.success('Club supprimé avec succès');
            GetAllUsers();
          } else {
            Utils.errorPage('Échec de la suppression du club');
          }
        } catch (error) {
          Utils.errorPage('Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
        }
      },
      () => console.log('Suppression annulée.')
    );
  };

  const handleViewUser = (id: number) => {
    setSelectedUserId(id);
    setShowDetails(true);
  };

  const handleEditUser = (id: number) => {
    setSelectedUserId(id);
    setShowUpdate(true);
  };

  useEffect(() => {
    GetAllUsers();
  }, []);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dataUsers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(dataUsers.length / recordsPerPage);

  return (
    <div className="list-club-container">
      <h2>Liste des Utilisateurs</h2>
      {Array.isArray(dataUsers) && dataUsers.length > 0 ? (

        <table className="clubs-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Age</th>
              <th>Mot de passe</th>
              <th>Genre</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataUsers.map((users, index) => (
              <tr key={index}>
                <td>{users.id}</td>
                <td>{users.name}</td>
                <td>{users.username}</td>
                <td>{users.email}</td>
                <td>{users.age}</td>
                <td>{users.password}</td>
                <td>{users.gender}</td>
                <td className="action-icons">
                  <FaEye className="icon view-icon" onClick={() => handleViewUser(users.id)} />
                  <FaEdit className="icon edit-icon" onClick={() => handleEditUser(users.id)} />
                  <FaTrash className="icon delete-icon" onClick={() => deleteUser(users.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Chargement..........</div>
      )}
        <div className="pagination">
          <div className="records-per-page">
            <select value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>Records per page</span>
          </div>
          <div className="page-controls">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              &lt;
            </button>
            <span>{`Showing ${indexOfFirstRecord + 1} to ${Math.min(indexOfLastRecord, dataUsers.length)} of ${dataUsers.length} records`}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
        </div>
      {showDetails && <GetUserDetails id={selectedUserId} onClose={() => setShowDetails(false)} />}
      {showUpdate && <UpdateUser id={selectedUserId} onClose={() => { setShowUpdate(false); GetAllUsers(); }} />}
    </div>
  );
};

export const AddEditUsers: React.FC = () => {
  const [UserData, setUserData] = useState({
    name: '', username: '', email: '', age: 0, password: '', ender: '',
  });

  const genderOptions = [
    { value: 'm', label: 'Male' },
    { value: 'f', label: 'Female' },
    { value: 'u', label: 'Unspecified' },
  ];

  const handleGenderChange = (selectedOption: any) => {
    setUserData((prevData) => ({
      ...prevData,
      gender: selectedOption?.value || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Utils.confirmMessage(
      'Êtes-vous sûr de vouloir créer cet utilisateur avec ces informations?',
      async () => {
        try {
          const formData = {
            ...UserData,
          };
          await UserService.createUser(formData);
          Utils.success('Utilisateur bien enregistré!');
          window.location.href = '/manage';
        } catch (error: any) {
          Utils.errorPage(error.response?.data?.detail || 'Une erreur s\'est produite');
        }
      },
      () => {
        console.log('Enregistrement annulé.');
      }
    );
  };

  return (
    <div className="add-edit-user-container">
      <h2>Ajouter un nouvel utilisateur</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            className="form-control"
            placeholder="Saisir le nom"
            value={UserData.name}
            onChange={(e) => setUserData({ ...UserData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            placeholder="Saisir le nom d'utilisateur"
            value={UserData.username}
            onChange={(e) => setUserData({ ...UserData, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Saisir l'email"
            value={UserData.email}
            onChange={(e) => setUserData({ ...UserData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Âge</label>
          <input
            type="number"
            className="form-control"
            placeholder="Saisir l'âge"
            value={UserData.age}
            onChange={(e) => setUserData({ ...UserData, age: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            placeholder="Saisir le mot de passe"
            value={UserData.password}
            onChange={(e) => setUserData({ ...UserData, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <Select
            options={genderOptions}
            value={genderOptions.find(option => option.value === UserData.gender)}
            onChange={handleGenderChange}
            className="form-control-select"
            placeholder="Choisir le genre"
          />
        </div>

        <div className="submit-section">
          <button type="submit" className="btn btn-primary">
            Enregistrer
          </button>
          <button type="button" className="btn btn-secondary">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
};

export const GetUserDetails: React.FC<DetailsProps> = ({ id, onClose }) => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await UserService.getUser(id);
        setUser(res.data);
      } catch (error) {
        Utils.errorPage(`Échec de récupération des détails du club ${error}`);
      }
    };
    fetchUser();
  }, [id]);
  
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Détails du Club</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {user ? (
              <div>
                <h4>{user.username}</h4>
                <p><strong>Nom:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Password:</strong> {user.password}</p>
              </div>
            ) : (
              <p>Chargement des détails...</p>
            )}
          </div>
          <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export const UpdateUser: React.FC<DetailsProps> = ({ id, onClose }) => {
  const [UserData, setUserData] = useState({ 
    name: '', username: '', email: '', age: 0, password: '', gender: '' 
  });

  const genderOptions = [
    { value: 'm', label: 'Male' },
    { value: 'f', label: 'Female' },
    { value: 'u', label: 'Unspecified' },
  ];

  const handleGenderChange = (selectedOption: any) => {
    setUserData((prevData) => ({
      ...prevData,
      gender: selectedOption?.value || '',
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await UserService.getUser(id);
        setUserData({
          name: res.data.name,
          username: res.data.username,
          email: res.data.email,
          age: res.data.age,
          password: res.data.password,
          gender: res.data.gender,
        });
      } catch (error) {
        Utils.errorPage(`Échec de récupération des détails de l'utilisateur ${error}`);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Utils.confirmMessage(
      'Êtes-vous sûr de vouloir mettre à jour l\'user avec ces informations?',
      async () => {
        try {
          const formData = {
            ...UserData,
          };
          await UserService.updateUser(id, formData);
          Utils.success('Utilisateur mis à jour avec succès!');
          onClose();
        } catch (error: any) {
          Utils.errorPage(error.response?.data?.detail || 'Une erreur s\'est produite');
        }
      },
      () => { 
        console.log('Mise à jour annulée.');
      }
    );
  };

return (
  <div className="modal fade show d-block" tabIndex={-1} role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Modifier l'Utilisateur</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                value={UserData.name}
                onChange={(e) => setUserData({ ...UserData, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                value={UserData.username}
                onChange={(e) => setUserData({ ...UserData, username: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={UserData.email}
                onChange={(e) => setUserData({ ...UserData, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Âge</label>
              <input
                type="number"
                className="form-control"
                value={UserData.age}
                onChange={(e) => setUserData({ ...UserData, age: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={UserData.password}
                onChange={(e) => setUserData({ ...UserData, password: e.target.value })}
                placeholder="Changer le mot de passe"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Genre</label>
              <Select
                options={genderOptions}
                value={genderOptions.find(option => option.value === UserData.gender)}
                onChange={handleGenderChange}
                className="form-control-select"
                placeholder="Choisir le genre"
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Enregistrer
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};
