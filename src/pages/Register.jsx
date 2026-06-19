import React, { useState } from "react";
import { Logo } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";

export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        try {
            await signUp(name, email, senha);
            navigate("/login");
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
            <div style={{ marginBottom: "15px" }}>
                <Logo />
            </div>

            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "360px" }}>
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ color: "var(--white)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
                        Nome
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Digite seu nome..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        Cadastrar
                    </button>
                </div>
            </form>

            <div style={{ marginTop: "24px" }}>
                <Link to="/login" style={{ color: "var(--white)", fontSize: "14px" }}>
                    Já tem cadastro? <strong>Faça Login</strong>
                </Link>
            </div>
        </div>
    );
}