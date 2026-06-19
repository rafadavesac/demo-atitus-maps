import { useEffect, useState } from "react";
import { Navbar } from "../components";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -28.2620,
  lng: -52.4083,
};

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
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

  const handleMapClick = (event) => {
    setPendingLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!patientName || !serviceType || !appointmentDate || !appointmentTime) {
      alert("Preencha todos os campos!");
      return;
    }

    const newPoint = {
      latitude: pendingLocation.lat,
      longitude: pendingLocation.lng,
      patientName,
      serviceType,
      appointmentDate,
      appointmentTime,
    };

    try {
      const savedPoint = await postPoint(token, newPoint);
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.patientName,
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
      handleCancel();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setPendingLocation(null);
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
              />
            ))}
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
              Novo Atendimento
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