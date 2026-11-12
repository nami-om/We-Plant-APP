import PlantCard from "./PlantCard.jsx";
import { getId } from "../services/plantasService.js";

export default function PlantList({
  plantas,
  carregando,
  totalGeral,
  onEditar,
  onExcluir,
}) {
  if (carregando) return <p className="estado">Carregando plantas…</p>;

  if (plantas.length === 0) {
    return (
      <p className="estado">
        {totalGeral === 0
          ? "Nenhuma planta cadastrada ainda. Clique em “Nova planta” para começar."
          : "Nenhuma planta encontrada."}
      </p>
    );
  }

  return (
    <div className="grid">
      {plantas.map((planta) => (
        <PlantCard
          key={getId(planta)}
          planta={planta}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}
    </div>
  );
}
