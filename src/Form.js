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
  const [mostrarMensaje, setMostrarMensaje] = useState(false)
  const API_KEY_HERE = "oePhGGthuj-8rPo7H1whPvRrzc1jmkVzuuvRCCq2sH4";

  // Maneja los cambios realizados en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

    if ((name === "nombre" || name === "apellido") && !soloLetras.test(value)) {
      alert("Solo se permiten letras y espacios en este campo.");
    }

    setFormData({ ...formData, [name]: value });
  };

  // Válida direcciones obtenidas de Here APi, verifica que sena de Argentina
  const validarDireccion = async (direccion) => {
    try {
      const response = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(direccion)}&apiKey=${API_KEY_HERE}`
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

  // Valida el numero de celular
  const validarTelefono = (telefono) => {
  // Verificar que solo contenga dígitos
  if (!/^\d+$/.test(telefono)) return false;

  // Validar para CABA: Código "11", sin "15" inmediatamente después, y 8 dígitos adicionales
  const regexCABA = /^11(?!15)\d{8}$/;
  // Validar para La Plata: Código "221", sin "15" inmediatamente después, y 7 dígitos adicionales
  const regexLaPlata = /^221(?!15)\d{7}$/;

  return regexCABA.test(telefono) || regexLaPlata.test(telefono);
};


  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta(""); // Limpia alertas previas
    setExito(""); // Limpia el mensaje de éxito previo

    const direccionValida = await validarDireccion(formData.direccion);
    if (!direccionValida) {
      setAlerta("⚠️ La dirección ingresada no es válida o no pertenece a Argentina. Verifícala.");
      return;
    }

    if (!validarTelefono(formData.telefono)) {
    setAlerta(`⚠️ El número de celular ingresado no esta en el formato solicitado. <br/>  
                  Asegúrate de ingresar el código de área correcto sin 0 ni 15. <br/>
                  Ej: 1136147785 para CABA o 22136147785 para La Plata.`);
    return;
  }

    // Aquí podrías enviar los datos a un backend

    setExito("✅ Formulario enviado con éxito.");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Hola, regístrate para obtener tu código</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        {alerta && <div className="alert alert-warning">{alerta}</div>}
        {exito && <div className="alert alert-success">{exito}</div>} {/* Muestra el mensaje de éxito */}

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
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa tu dirección"
            onFocus={() => setMostrarMensaje(true)}
            onBlur={() => setMostrarMensaje(false)}
          />
        {mostrarMensaje && (
            <div style={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#d1f7f7",
              color: "#721c24",
              padding: "15px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
            }}>
              📢 Ingrese la dirección con el siguiente formato <br/>
                  Calle Num Localidad Ciudad <br/>
                  Ej: 52 742 Villa Elisa La Plata 
            </div>
        )}
        </div>

        <div className="mb-3">
          <label className="form-label">Celular:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa tu número de celular"
            required
            onFocus={() => setMostrarMensaje(true)}
            onBlur={() => setMostrarMensaje(false)}
          />
        {mostrarMensaje && (
            <div style={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#d1f7f7",
              color: "#721c24",
              padding: "15px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
            }}>
              📢 Ingrese su celular sin cero y sin 15 <br/>
                  Ej: 1136147785 
            </div>
        )}
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

        <button type="submit" className="btn-custom">Enviar</button>
      </form>
    </div>
  );
}

export default Formulario;
