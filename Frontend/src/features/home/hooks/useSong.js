import { getSong } from "../services/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context.instance";

export const useSong = () => {
  const context = useContext(SongContext);
  const { loading, setLoading, song, setSong } = context;

  async function handleGetSong({ mood }) {
    if (!mood) {
      return null;
    }

    setLoading(true);

    try {
      const data = await getSong({ mood });
      setSong(data.song);
      return data.song;
    } finally {
      setLoading(false);
    }
  }

  return { loading, song, handleGetSong };
};
