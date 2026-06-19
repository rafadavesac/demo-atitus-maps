import React, { useState } from "react";
import { Logo } from "../components";
import { signIn } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const token = await signIn(email, senha);
      login(token);
      navigate("/map");
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div style={{
      backgroundColor: "var(--teal)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
    }}>
      <div style={{ marginBottom: "40px" }}>
        <Logo />
      </div>

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "var(--white)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <input
            type="email"
            required
            placeholder="Digite seu email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "var(--teal-input)",
              border: "none",
              borderRadius: "30px",
              padding: "14px 20px",
              color: "var(--white)",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ color: "var(--white)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
            Senha
          </label>
          <input
            type="password"
            required
            placeholder="Digite sua senha..."
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "var(--teal-input)",
              border: "none",
              borderRadius: "30px",
              padding: "14px 20px",
              color: "var(--white)",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        {erro && (
          <p style={{ color: "#fff", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "8px 12px", marginBottom: "8px" }}>
            {erro}
          </p>
        )}

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--dark)",
              border: "none",
              borderRadius: "30px",
              padding: "14px 60px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Entrar
          </button>
        </div>
      </form>

      <div style={{ marginTop: "24px" }}>
        <Link to="/register" style={{ color: "var(--white)", fontSize: "14px" }}>
          Não possui cadastro? <strong>Inscreva-se!</strong>
        </Link>
      </div>
    </div>
  );
}