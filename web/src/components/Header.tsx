import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";


function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const themeLabel = theme === "light"
    ? "Passer en mode sombre"
    : "Passer en mode clair";

  return (
    <header className="header">
      <Link className="logo" to="/">
        Ma Collection
      </Link>

      <nav className="navigation">
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
        >
          <span aria-hidden="true">
            {theme === "light" ? "☾" : "☀"}
          </span>

          <span className="theme-toggle-label">
            {theme === "light" ? "Sombre" : "Clair"}
          </span>
        </button>

        {isAuthenticated ? (
          <>
            <Link to="/collection">Ma collection</Link>
            <Link to="/stats">Statistiques</Link>

            <button type="button" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}


export default Header;