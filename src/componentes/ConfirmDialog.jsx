export default function ConfirmDialog({
  planta,
  excluindo,
  onConfirmar,
  onCancelar,
}) {
  return (
    <div
      className="modal-fundo"
      role="alertdialog"
      aria-modal="true"
      aria-label="Confirmar exclusão"
    >
      <div className="modal">
        <h2>Excluir planta?</h2>
        <p>
          Tem certeza que deseja excluir <strong>{planta.nomeComum}</strong>?
          Essa ação não pode ser desfeita.
        </p>
        <div className="form-actions">
          <button
            type="button"
            className="btn"
            onClick={onCancelar}
            disabled={excluindo}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger-solid"
            onClick={onConfirmar}
            disabled={excluindo}
          >
            {excluindo ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
