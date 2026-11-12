import { TIPOS } from "../constants.js";

export default function SearchBar({ busca, onBusca, tipo, onTipo }) {
  return (
    <div className="searchbar">
      <input
        type="search"
        placeholder="Pesquisar por nome comum, científico ou família…"
        value={busca}
        onChange={(e) => onBusca(e.target.value)}
        aria-label="Pesquisar plantas"
      />
      <select
        value={tipo}
        onChange={(e) => onTipo(e.target.value)}
        aria-label="Filtrar por tipo"
      >
        <option value="">Todos os tipos</option>
        {TIPOS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
