import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import nokiaLogo from "./assets/nokia-logo.jpg";

function App() {

  const [devices, setDevices] = useState([
    { device_id: "ESD001" },
    { device_id: "ESD002" },
    { device_id: "ESD003" },
    { device_id: "ESD004" },
    { device_id: "ESD005" },
    { device_id: "ESD006" },
    { device_id: "ESD007" },
    { device_id: "ESD008" },
    { device_id: "ESD009" },
    { device_id: "ESD010" }
  ]);

  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const selectedDevice =
  devices.find(
    device => device.device_id === selectedDeviceId
  ) || null;

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await axios.get(
          "http://127.0.0.1:8000/api/latest/"
        );

        if (!Array.isArray(response.data)) {

          const liveDevice = response.data;

          setDevices(prevDevices =>
            prevDevices.map(device =>
              device.device_id === liveDevice.device_id
                ? liveDevice
                : device
            )
          );

          

        } else {

          setDevices(prevDevices =>
            prevDevices.map(device => {

              const liveDevice = response.data.find(
                d => d.device_id === device.device_id
              );

              return liveDevice || device;
            })
          );

          

        }

      } catch (error) {

        console.error(
          "Backend connection error:",
          error
        );

      }
    };

    fetchData();

    const interval = setInterval(
      fetchData,
      1000
    );

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="container">

      <header className="header">

        <div className="logo-section">
          <img
            src={nokiaLogo}
            alt="Nokia Logo"
            className="nokia-logo"
          />
        </div>

        <div className="title-section">
          <h1>ESD Monitoring Dashboard</h1>
          <p>
            Real-Time ESD Compliance Monitoring System
          </p>
        </div>

      </header>

      <div className="device-grid">

        {devices.map((device) => {

          const online =
            device.online===true;

          return (

            <div
              key={device.device_id}
              onClick={() => setSelectedDeviceId(device.device_id)}
              className={`device-card ${
                !online
                  ? "offline"
                  : device.esd_ok
                  ? "healthy"
                  : "fault"
              }`}
            >

              <div className="card-header">

                <h2>{device.device_id}</h2>

                <span
                  className={`status-dot ${
                    online
                      ? "green"
                      : "gray"
                  }`}
                ></span>

              </div>

              <div className="card-body">

                <p>
                  <strong>Human:</strong>{" "}
                  {!online
                    ? "--"
                    : device.human_present
                    ? "Present"
                    : "Not Present"}
                </p>

                <p>
                  <strong>ESD:</strong>{" "}
                  {!online
                    ? "--"
                    : device.esd_ok
                    ? "OK"
                    : "FAULT"}
                </p>

                <p>
                  <strong>Voltage:</strong>{" "}
                  {!online
                    ? "--"
                    : `${device.voltage} V`}
                </p>

                <p>
                  <strong>Distance:</strong>{" "}
                  {!online
                    ? "--"
                    : `${device.distance} cm`}
                </p>

              </div>

            </div>

          );

        })}

      </div>

      {selectedDevice && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedDeviceId(null)}
        >

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-btn"
              onClick={() => setSelectedDeviceId(null)}
            >
              ✕
            </button>

            <h2>{selectedDevice.device_id}</h2>

            <div className="modal-details">

              <p
                style={{
                  color: "#2ecc71",
                  fontWeight: "bold",
                  marginBottom: "20px"
                }}
              >
                ● Live Device Information
              </p>

              <p>
                <strong>Device ID:</strong>{" "}
                {selectedDevice.device_id}
              </p>

              <p>
                <strong>Human Presence:</strong>{" "}
                {selectedDevice.human_present === undefined
                  ? "--"
                  : selectedDevice.human_present
                  ? "Present"
                  : "Not Present"}
              </p>

              <p>
                <strong>ESD Status:</strong>{" "}
                {selectedDevice.esd_ok === undefined
                  ? "--"
                  : selectedDevice.esd_ok
                  ? "OK"
                  : "FAULT"}
              </p>

              <p>
                <strong>Voltage:</strong>{" "}
                {selectedDevice.voltage ?? "--"} V
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                {selectedDevice.distance ?? "--"} cm
              </p>

              <p>
  <strong>Device Health:</strong>{" "}
  {selectedDevice.online
    ? "🟢 Active"
    : "🔴 Disconnected"}
</p>

<p>
  <strong>Last Communication:</strong>{" "}
  {selectedDevice.last_seen_seconds ?? "--"} sec ago
</p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date().toLocaleTimeString()}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default App;