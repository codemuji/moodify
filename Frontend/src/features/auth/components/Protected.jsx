import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="app-loading-screen">
        <section className="app-loading-screen__card">
          <span className="app-loading-screen__spinner" />
          <p>Preparing your session</p>
          <h1>Restoring your music workspace...</h1>
        </section>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;
