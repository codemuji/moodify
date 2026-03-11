import "../style/login.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  }
  return (
    <main className="auth-page auth-page--login">
      <section className="auth-page__hero">
        <span className="auth-page__badge">Moodify experience</span>
        <div className="auth-page__headline">
          <h1>Music that reacts to your face in real time.</h1>
          <p>
            Sign in to scan your expression, match the mood instantly, and keep
            the listening experience sharp and fast.
          </p>
        </div>
        <div className="auth-page__stats">
          <article className="auth-page__stat">
            <strong>1 tap</strong>
            <span>Detect your expression and jump to a matching track.</span>
          </article>
          <article className="auth-page__stat">
            <strong>Live camera</strong>
            <span>Face tracking runs directly inside the app workflow.</span>
          </article>
          <article className="auth-page__stat">
            <strong>Instant mood fit</strong>
            <span>Recommendations adapt to happy, sad, and surprised states.</span>
          </article>
        </div>
        <div className="auth-page__highlights">
          <p className="auth-page__highlight">
            <strong>Clean session flow</strong>
            Authentication and playback live in a single uninterrupted journey.
          </p>
          <p className="auth-page__highlight">
            <strong>Production-oriented polish</strong>
            Stronger hierarchy, spacing, states, and mobile responsiveness.
          </p>
        </div>
      </section>

      <section className="auth-page__panel">
        <div className="auth-page__panel-copy">
          <p className="auth-page__eyebrow">Welcome back</p>
          <h2>Sign in to your listening space</h2>
          <p>
            Pick up where you left off and let the next track follow your mood.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
          />
          <button className="button button--full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-page__switch">
          Don&apos;t have an account? <Link to="/register">Create one here</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
