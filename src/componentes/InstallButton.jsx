import { useEffect, useState } from "react";

// Mostra um botão "Instalar" quando o navegador permite instalar o PWA.
export default function InstallButton() {
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    const aoPoderInstalar = (e) => {
      e.preventDefault();
      setEvento(e);
    };
    const aoInstalar = () => setEvento(null);

    window.addEventListener("beforeinstallprompt", aoPoderInstalar);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoPoderInstalar);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  if (!evento) return null;

  const instalar = async () => {
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  };

  return (
    <button type="button" className="btn" onClick={instalar}>
      Instalar app
    </button>
  );
}
