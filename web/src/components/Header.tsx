import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <Link className="logo" to="/">
        Ma Collection
      </Link>

      <nav className="navigation">
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