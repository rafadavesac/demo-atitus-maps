import logo from "./LogoMedHome.png";

export const Logo = () => {
  return (
    <img
      src={logo}
      alt="MedHome"
      style={{ width: "420px", maxWidth: "100%" }}
    />
  );
};