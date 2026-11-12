export default function Toast({ mensagem, onFechar }) {
  if (!mensagem) return null;
  return (
    <div className={`toast toast-${mensagem.tipo}`} role="status" aria-live="polite">
      <span>{mensagem.texto}</span>
      <button type="button" onClick={onFechar} aria-label="Fechar mensagem">
        ×
      </button>
    </div>
  );
}
