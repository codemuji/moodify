import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";
import "../styles/home.scss";

const Home = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { handleGetSong, loading, song } = useSong();

  async function handleLogoutClick() {
    await handleLogout();
    navigate("/login");
  }

  return (
    <main className="home-page">
      <div className="home-page__shell">
        <section className="home-page__hero">
          <article className="home-page__hero-card">
            <p className="home-page__eyebrow">Moodify control room</p>
            <div className="home-page__headline">
              <h1>Turn facial cues into a polished music flow.</h1>
              <p>
                Detect a live expression, fetch a matching track, and manage the
                listening session from a cleaner, more intentional interface.
              </p>
            </div>
            <div className="home-page__hero-footer">
              <span className="home-page__badge">
                Current mood: {song?.mood || "Unknown"}
              </span>
              <span className="home-page__badge">
                {loading ? "Matching a new track" : "Ready for another scan"}
              </span>
            </div>
          </article>

          <aside className="home-page__user-card">
            <div className="home-page__user-meta">
              <span className="home-page__avatar">
                {(user?.username || user?.email || "M").charAt(0).toUpperCase()}
              </span>
              <div className="home-page__user-copy">
                <p>Signed in</p>
                <h2>{user?.username || "Moodify listener"}</h2>
                <span>{user?.email || "Ready to scan and play"}</span>
              </div>
            </div>

            <button
              className="button button--ghost"
              type="button"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </aside>
        </section>

        <section className="home-page__highlights">
          <article className="home-page__highlight">
            <span>Current track</span>
            <strong>{song?.title || "Waiting for selection"}</strong>
            <p>The player updates as soon as the next expression is detected.</p>
          </article>
          <article className="home-page__highlight">
            <span>Detection mode</span>
            <strong>{loading ? "Analyzing mood" : "Live and ready"}</strong>
            <p>Camera scanning and track matching now read like one guided flow.</p>
          </article>
          <article className="home-page__highlight">
            <span>Experience goal</span>
            <strong>Fast, cinematic, clear</strong>
            <p>
              Stronger hierarchy, cleaner spacing, and better states across the
              full app.
            </p>
          </article>
        </section>

        <section className="home-page__content">
          <div className="home-page__panel">
            <FaceExpression
              currentMood={song?.mood || "happy"}
              loading={loading}
              onClick={(expression) => handleGetSong({ mood: expression })}
            />
          </div>

          <div className="home-page__panel">
            <Player key={song?.url || "player-default"} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
