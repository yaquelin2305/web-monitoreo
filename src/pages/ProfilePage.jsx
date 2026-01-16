import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMedicalRecord, updateMedicalRecord } from '../services/MedicalService'; 
import '../Styles/ProfileStyles.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Estado para el Nombre del Usuario (NUEVO)
  const [userName, setUserName] = useState("Mi Perfil"); 

  // 2. Estado para modo edición
  const [isEditing, setIsEditing] = useState(false);
  
  // 3. Estado temporal para el formulario
  const [formData, setFormData] = useState({});

  const fetchProfile = async () => {
    const userId = localStorage.getItem('user_id');
    
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUserName(storedName);
    }

    if (!userId) { navigate('/login'); return; }

    try {
      const data = await getMedicalRecord(userId);
      setProfile(data);
      setFormData(data || {}); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      await updateMedicalRecord(userId, {
        ...formData,
        current_weight: formData.initial_weight 
      });
      setProfile(formData); 
      setIsEditing(false);  
      alert("¡Perfil actualizado con éxito!");
    } catch (error) {
      alert("Error al guardar cambios");
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Cargando...</div>;
  
  // Empty State (Si no tiene ficha)
  if (!profile) return (
    <div className="profile-container">
        <div className="empty-state">
          <h2>⚠️ Aún no tienes ficha médica</h2>
          <p>Hola <b>{userName}</b>, necesitamos tus datos base para comenzar.</p>
          <Link to="/ficha-medica" className="btn-create-record">
            Crear Ficha Médica Ahora
          </Link>
        </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <div className="profile-title">
          <h1 style={{textTransform: 'capitalize'}}>{userName}</h1>
          <p>Información Médica Personal</p>
        </div>
        

        {!isEditing && (
          <button 
            className="btn-edit" 
            onClick={() => setIsEditing(true)}
            style={{marginLeft: 'auto', background:'white', color:'#2563eb', border:'none', padding:'10px 20px', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}
          >
             Editar
          </button>
        )}
      </div>

      <div className="profile-grid">
        <div className="info-card">
          <div className="card-header">
            <span>📏</span>
            <h3>Datos Corporales</h3>
          </div>
          
          <div className="info-item">
            <span className="info-label">Estatura (cm)</span>
            {isEditing ? (
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="form-input-edit" />
            ) : (
              <span className="info-value">{profile.height} cm</span>
            )}
          </div>

          <div className="info-item">
            <span className="info-label">Peso (kg)</span>
            {isEditing ? (
              <input type="number" name="initial_weight" value={formData.initial_weight} onChange={handleChange} className="form-input-edit" />
            ) : (
              <span className="info-value">{profile.initial_weight} kg</span>
            )}
          </div>
          
           <div className="info-item">
            <span className="info-label">Grupo Sanguíneo</span>
             {isEditing ? (
              <select name="blood_type" value={formData.blood_type} onChange={handleChange} className="form-input-edit">
                  <option value="A+">A+</option>
                  <option value="O+">O+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="A-">A-</option>
                  <option value="O-">O-</option>
    
              </select>
            ) : (
              <span className="info-value">{profile.blood_type}</span>
            )}
          </div>
        </div>

        <div className="info-card">
          <div className="card-header">
            <span>⚠️</span>
            <h3>Alertas Médicas</h3>
          </div>
          <div className="info-item">
            <span className="info-label">Alergias</span>
            {isEditing ? (
              <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="form-input-edit" />
            ) : (
              <span className="info-value">{profile.allergies || 'Ninguna'}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Enf. Crónicas</span>
             {isEditing ? (
              <input type="text" name="chronic_diseases" value={formData.chronic_diseases} onChange={handleChange} className="form-input-edit" />
            ) : (
              <span className="info-value">{profile.chronic_diseases || 'Ninguna'}</span>
            )}
          </div>
        </div>

        <div className="info-card">
          <div className="card-header">
            <span>📞</span>
            <h3>Emergencia</h3>
          </div>
          <div className="info-item">
            <span className="info-label">Nombre Contacto</span>
             {isEditing ? (
              <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} className="form-input-edit" />
            ) : (
              <span className="info-value">{profile.emergency_contact_name}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Teléfono</span>
             {isEditing ? (
              <input type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} className="form-input-edit" />
            ) : (
              <span className="info-value">{profile.emergency_contact_phone}</span>
            )}
          </div>
        </div>
      </div>
      {isEditing && (
        <div style={{marginTop: '30px', display:'flex', gap:'15px', justifyContent:'center'}}>
          <button onClick={handleSave} className="btn-create-record">Guardar Cambios</button>
          <button 
            onClick={() => { setIsEditing(false); setFormData(profile); }} 
            style={{padding:'12px 25px', background:'#ef4444', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;