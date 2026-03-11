import { useState } from "react";
import { SongContext } from "./song.context.instance";

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "https://ik.imagekit.io/cmrg4tptz/cohort-2/moodify/songs/Aaraaro_Aararo__From__quot_Bholaa_quot____DownloadMing.WS__R7Sk5vjsY.mp3",
    posterUrl:
      "https://ik.imagekit.io/cmrg4tptz/cohort-2/moodify/posters/Aaraaro_Aararo__From__quot_Bholaa_quot____DownloadMing.WS__5bkXKJLHP.jpeg",
    title: "Aaraaro Aararo (From &quot;Bholaa&quot;) [DownloadMing.WS]",
    mood: "happy",
  });
  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ loading, setLoading, song, setSong }}>
      {children}
    </SongContext.Provider>
  );
};
