import { useEffect, useState } from "react";
import { Navbar } from "../components";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint, putPoint, deletePoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: -28.2620, lng: -52.4083 };

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  // Clique no mapa — abre modal para novo atendimento
  const handleMapClick = (event) => {
    setSelectedMarker(null);
    setPendingLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    setEditingId(null);
    setModalOpen(true);
  };

  // Clique no marcador — abre popup com opções
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  // Abre modal preenchido para edição
  const handleEdit = (marker) => {
    setSelectedMarker(null);
    setEditingId(marker.id);
    setPendingLocation(marker.position);
    setPatientName(marker.title);
    setServiceType(marker.serviceType);
    setAppointmentDate(marker.appointmentDate);
    setAppointmentTime(marker.appointmentTime);
    setModalOpen(true);
  };

  // Deleta o marcador
  const handleDelete = async (marker) => {
    if (!confirm(`Deseja excluir o atendimento de ${marker.title}?`)) return;
    try {
      await deletePoint(token, marker.id);
      setMarkers(prev => prev.filter(m => m.id !== marker.id));
      setSelectedMarker(null);
    } catch (error) {
      alert(error.message);
    }
  };

  // Confirma cadastro ou edição
  const handleConfirm = async () => {
    if (!patientName || !serviceType || !appointmentDate || !appointmentTime) {
      alert("Preencha todos os campos!");
      return;
    }

    const pointData = {
      latitude: pendingLocation.lat,
      longitude: pendingLocation.lng,
      patientName,
      serviceType,
      appointmentDate,
      appointmentTime,
    };

    try {
      if (editingId) {
        // Edição
        const updated = await putPoint(token, editingId, pointData);
        setMarkers(prev => prev.map(m => m.id === editingId ? {
          id: updated.id,
          title: updated.patientName,
          serviceType: updated.serviceType,
          appointmentDate: updated.appointmentDate,
          appointmentTime: updated.appointmentTime,
          position: { lat: updated.latitude, lng: updated.longitude },
        } : m));
      } else {
        // Novo cadastro
        const saved = await postPoint(token, pointData);
        setMarkers(prev => [...prev, {
          id: saved.id,
          title: saved.patientName,
          serviceType: saved.serviceType,
          appointmentDate: saved.appointmentDate,
          appointmentTime: saved.appointmentTime,
          position: { lat: saved.latitude, lng: saved.longitude },
        }]);
      }
      handleCancel();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setPendingLocation(null);
    setEditingId(null);
    setPatientName("");
    setServiceType("");
    setAppointmentDate("");
    setAppointmentTime("");
  };

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", height: "100%" }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onClick={handleMapClick}
          >
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div style={{ fontFamily: "Arial", minWidth: "180px" }}>
                  <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>
                    {selectedMarker.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#555", marginBottom: "2px" }}>
                    {selectedMarker.serviceType}
                  </p>
                  <p style={{ fontSize: "12px", color: "#555", marginBottom: "12px" }}>
                    {selectedMarker.appointmentDate} às {selectedMarker.appointmentTime}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(selectedMarker)}
                      style={{
                        flex: 1, padding: "6px", borderRadius: "8px",
                        border: "2px solid #3FB6AC", background: "#fff",
                        color: "#3FB6AC", fontWeight: "bold", cursor: "pointer", fontSize: "12px"
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMarker)}
                      style={{
                        flex: 1, padding: "6px", borderRadius: "8px",
                        border: "none", background: "#e53935",
                        color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "12px"
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div>Carregando mapa...</div>
        )}
      </div>

      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#3FB6AC",
            borderRadius: "16px",
            padding: "32px",
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            <h2 style={{ fontWeight: "bold", fontSize: "20px", color: "#fff", textAlign: "center" }}>
              {editingId ? "Editar Atendimento" : "Novo Atendimento"}
            </h2>

            <div>
              <label style={{ fontWeight: "bold", color: "#fff", display: "block", marginBottom: "4px" }}>
                Nome do Paciente
              </label>
              <input
                style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.25)", border: "none", borderRadius: "30px", padding: "12px 20px", color: "#fff", fontSize: "14px", outline: "none" }}
                placeholder="Digite o nome do paciente..."
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontWeight: "bold", color: "#fff", display: "block", marginBottom: "4px" }}>
                Tipo de Atendimento
              </label>
              <input
                style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.25)", border: "none", borderRadius: "30px", padding: "12px 20px", color: "#fff", fontSize: "14px", outline: "none" }}
                placeholder="Ex: Enfermagem, Fisioterapia..."
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontWeight: "bold", color: "#fff", display: "block", marginBottom: "4px" }}>
                Data
              </label>
              <input
                style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.25)", border: "none", borderRadius: "30px", padding: "12px 20px", color: "#fff", fontSize: "14px", outline: "none" }}
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontWeight: "bold", color: "#fff", display: "block", marginBottom: "4px" }}>
                Horário
              </label>
              <input
                style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.25)", border: "none", borderRadius: "30px", padding: "12px 20px", color: "#fff", fontSize: "14px", outline: "none" }}
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1, padding: "12px", borderRadius: "30px",
                  border: "2px solid #fff", background: "transparent",
                  color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "15px"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1, padding: "12px", borderRadius: "30px",
                  border: "none", background: "#fff",
                  color: "#3FB6AC", fontWeight: "bold", cursor: "pointer", fontSize: "15px"
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};