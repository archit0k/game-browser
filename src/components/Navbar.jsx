import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ margin: "0 10px", color: "white" }}>Home</Link>
      <Link to="/browse" style={{ margin: "0 10px", color: "white" }}>Browse</Link>
      <Link to="/wishlist" style={{ margin: "0 10px", color: "white" }}>Wishlist</Link>
      <Link to="/recommendations" style={{ margin: "0 10px", color: "white" }}>Recommendations</Link>
    </nav>
  );
}
