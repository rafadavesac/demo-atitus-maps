import "./navbar.css";
import { useAuth } from "../../contexts/AuthContext";
import logo from "./LogoNav.png";

export function Navbar() {
    const { logout } = useAuth();

    return (
        <header className="navbar">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                      src={logo}
                      alt="MedHome"
                      style={{ width: "150px", maxWidth: "100%" }}
                    />
            </div>
            <button className="close" onClick={logout}>
                Sair
            </button>
        </header>
    );
}