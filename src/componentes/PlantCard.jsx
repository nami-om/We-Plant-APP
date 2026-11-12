import { getId } from "../services/plantasService.js";

export default function PlantCard({ planta, onEditar, onExcluir }) {
  const id = getId(planta);

  return (
    <article className="card">
      {planta.imagemUrl ? (
        <img src={planta.imagemUrl} alt={planta.nomeComum} loading="lazy" />
      ) : (
        <div className="card-placeholder" aria-hidden="true">
          🌿
        </div>
      )}
      <div className="card-body">
        <h3>{planta.nomeComum}</h3>
        <p className="cientifico">{planta.nomeCientifico}</p>
        <ul className="tags">
          {planta.tipo && <li>{planta.tipo}</li>}
          {planta.luminosidade && <li>☀ {planta.luminosidade}</li>}
          {planta.rega && <li>💧 {planta.rega}</li>}
        </ul>
        {planta.familia && <p className="meta">Família: {planta.familia}</p>}
        <p className="meta">Em estoque: {planta.quantidade ?? 0}</p>
        {planta.descricao && <p className="descricao">{planta.descricao}</p>}
      </div>
      <div className="card-actions">
        <button type="button" className="btn" onClick={() => onEditar(planta)}>
          Editar
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onExcluir(planta)}
          data-id={id}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
