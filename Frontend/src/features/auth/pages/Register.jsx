import "../style/register.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  }
  return (
    <main className="auth-page auth-page--register">
      <section className="auth-page__hero">
        <span className="auth-page__badge">Moodify onboarding</span>
        <div className="auth-page__headline">
          <h1>Build a calmer, smarter entry into your music app.</h1>
          <p>
            Create an account to unlock a mood-first interface that turns
            expression detection into a simple daily ritual.
          </p>
        </div>
        <div className="auth-page__stats">
          <article className="auth-page__stat">
            <strong>Fast setup</strong>
            <span>Join in seconds with a compact, focused registration flow.</span>
          </article>
          <article className="auth-page__stat">
            <strong>Responsive UI</strong>
            <span>The experience scales cleanly across desktop and mobile.</span>
          </article>
          <article className="auth-page__stat">
            <strong>Better context</strong>
            <span>Every screen explains what the product does at a glance.</span>
          </article>
        </div>
        <div className="auth-page__highlights">
          <p className="auth-page__highlight">
            <strong>Designed for clarity</strong>
            Strong headings, cleaner forms, and less dead space across the page.
          </p>
          <p className="auth-page__highlight">
            <strong>Ready for the main flow</strong>
            New users understand scanning, matching, and playback immediately.
          </p>
        </div>
      </section>

      <section className="auth-page__panel">
        <div className="auth-page__panel-copy">
          <p className="auth-page__eyebrow">Create account</p>
          <h2>Start your mood-based music session</h2>
          <p>Set up your profile and move straight into the live detector.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormGroup
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            label="Name"
            placeholder="Enter your name"
            autoComplete="name"
          />
          <FormGroup
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            label="Email"
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
          />
          <FormGroup
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            label="Password"
            placeholder="Enter your password"
            type="password"
            autoComplete="new-password"
          />
          <button className="button button--full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-page__switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
