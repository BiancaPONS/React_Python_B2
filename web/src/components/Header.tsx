import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <Link className="logo" to="/">
        Ma Collection
      </Link>

      <nav className="navigation">
        <Link to="/">Catalogue</Link>
        <Link to="/login">Connexion</Link>
        <Link to="/register">Inscription</Link>
      </nav>
    </header>
  );
}

export default Header;