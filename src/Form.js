import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const [alerta, setAlerta] = useState("");
  const [exito, setExito] = useState("");
  const [avisoNumero, setAvisoNumero] = useState(false);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const API_KEY_HERE = "oePhGGthuj-8rPo7H1whPvRrzc1jmkVzuuvRCCq2sH4";

  // Maneja los cambios realizados en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

    if ((name === "nombre" || name === "apellido") && !soloLetras.test(value)) {
      alert("Solo se permiten letras y espacios en este campo.");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Válida direcciones obtenidas de Here APi, verifica que sena de Argentina
  const validarDireccion = async (calle, numero, ciudad, provincia) => {
    try {
        // Construir la dirección completa
        const direccionCompleta = `${calle} ${numero}, ${ciudad}, ${provincia}, Argentina`;

        const response = await axios.get(
            `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
                direccionCompleta
            )}&apiKey=${API_KEY_HERE}`
        );

        if (response.data.items.length === 0) return false;

        console.log(response.data);

        const esArgentina = response.data.items.some(
            (item) => item.address.countryName === "Argentina"
        );

        return esArgentina;
    } catch (error) {
        console.error("Error en la validación:", error);
        return false;
    }
};

  // Valida el número de teléfono
  const validarTelefono = (codigoArea, numeroCelular) => {
    // Verificar que ambos valores sean solo dígitos
    if (!/^\d+$/.test(codigoArea) || !/^\d+$/.test(numeroCelular)) return false;
  
    // Validar que el código de área no empiece con 0
    if (/^0/.test(codigoArea)) return false;
  
    // Validar que el número de celular tenga exactamente 8 dígitos
    if (!/^\d{8}$/.test(numeroCelular)) return false;
  
    return true;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.com(\.ar)?$/;
    return regex.test(email);
};

  

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta(""); // Limpia alertas previas
    setExito(""); // Limpia el mensaje de éxito previo

    const direccionValida = await validarDireccion(
      formData.calle, formData.numero, formData.localidad, formData.ciudad);
    if (!direccionValida) {
      setAlerta(
        "⚠️ La dirección ingresada no es válida o no pertenece a Argentina. Verifícala."
      );
      return;
    }

    if (!validarTelefono(formData.codigoArea, formData.numeroCelular)) {
      setAlerta(`⚠️ El número ingresado no es correcto.  
                  Verifícalo`);
      return;
    }

    if (!validarEmail(formData.email)) {
      setAlerta("⚠️ El correo electrónico ingresado no es válido. Verifícalo.");
      return;
  }
  

    // Aquí podrías enviar los datos a un backend

    setExito("✅ Formulario enviado con éxito.");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Hola, regístrate para obtener tu código
      </h2>

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        {alerta && <div className="alert alert-warning">{alerta}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}{" "}
        {/* Muestra el mensaje de éxito */}
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa tu apellido"
            required
          />
        </div>
        <div className="mb-3">
  <label className="form-label">Dirección:</label>
  <div className="row">
    <div className="col-6">
      <input
        type="text"
        name="calle"
        value={formData.calle}
        onChange={handleChange}
        className="form-control"
        placeholder="Calle"
        required
      />
    </div>
    <div className="col-6">
      <input
        type="text"
        name="numero"
        value={formData.numero}
        onChange={handleChange}
        className="form-control"
        placeholder="Número"
        required
      />
    </div>
  </div>
  <div className="row mt-2">
    <div className="col-6">
      <input
        type="text"
        name="localidad"
        value={formData.localidad}
        onChange={handleChange}
        className="form-control"
        placeholder="Localidad"
        required
      />
    </div>
    <div className="col-6">
      <input
        type="text"
        name="ciudad"
        value={formData.ciudad}
        onChange={handleChange}
        className="form-control"
        placeholder="Ciudad"
        required
      />
    </div>
  </div>
</div> 

        <div className="mb-3">
          <label className="form-label">Teléfono:</label>
          <div className="row">
            
            <div className="col-3">
              <input
                type="text"
                name="codigoArea"
                value={formData.codigoArea}
                onChange={handleChange}
                className="form-control"
                placeholder="Código"
                required
                onFocus={() => setMostrarAviso(true)}
                onBlur={() => setMostrarAviso(false)}
              />
              {mostrarAviso && (
                <div style={{
              position: "fixed",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#d1f7f7",
              color: "#721c24",
              padding: "15px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
            }}>
              📢 Ingrese el código de área sin cero <br/>
            </div>
            )}
            </div>

            {/* Espacio entre los inputs */}
            <div className="col-1 d-flex align-items-center justify-content-center">
              <span className="fw-bold">-</span>
            </div>

            <div className="col-8">
              <input
                type="text"
                name="numeroCelular"
                value={formData.numeroCelular}
                onChange={handleChange}
                className="form-control"
                placeholder="Número de celular"
                required
                onFocus={() => setAvisoNumero(true)}
                onBlur={() => setAvisoNumero(false)}
              />
              {avisoNumero && (
                <div style={{
              position: "fixed",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#d1f7f7",
              color: "#721c24",
              padding: "15px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
            }}>
              📢 Ingrese el número sin el 15 <br/>
            </div>
            )}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa tu email"
            required
          />
        </div>
        <button type="submit" className="btn-custom">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Formulario;
