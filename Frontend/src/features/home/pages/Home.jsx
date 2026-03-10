import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";
const Home = () => {
  const { handleGetSong } = useSong();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2rem",
        alignItems: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, rgba(255, 106, 0, 0.18), transparent 28%), #050505",
      }}
    >
      <FaceExpression
        onClick={(expression) => {
          handleGetSong({ mood: expression });
        }}
      />
      <Player />
    </main>
  );
};

export default Home;
