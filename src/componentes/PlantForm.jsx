import { useState } from "react";
import { LUMINOSIDADES, PLANTA_VAZIA, REGAS, TIPOS } from "../constants.js";

function validar(dados) {
  const erros = {};
  if (!dados.nomeComum.trim()) erros.nomeComum = "Informe o nome comum";
  if (!dados.nomeCientifico.trim())
    erros.nomeCientifico = "Informe o nome científico";
  if (!dados.tipo) erros.tipo = "Selecione o tipo da planta";

  const qtd = Number(dados.quantidade);
  if (dados.quantidade === "" || !Number.isInteger(qtd) || qtd < 0) {
    erros.quantidade =
      "A quantidade deve ser um número inteiro maior ou igual a 0";
  }

  if (dados.imagemUrl.trim()) {
    try {
      const url = new URL(dados.imagemUrl.trim());
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      erros.imagemUrl = "Informe uma URL válida (http:// ou https://)";
    }
  }

  if (dados.descricao.length > 500)
    erros.descricao = "A descrição pode ter no máximo 500 caracteres";
  return erros;
}

function CampoBase({ campo, rotulo, obrigatorio, erros, children }) {
  return (
    <label className="campo">
      <span>
        {rotulo}
        {obrigatorio && " *"}
      </span>
      {children}
      {erros[campo] && <small className="erro">{erros[campo]}</small>}
    </label>
  );
}

export default function PlantForm({ planta, salvando, onSalvar, onCancelar }) {
  const editando = Boolean(planta);
  const [dados, setDados] = useState({ ...PLANTA_VAZIA, ...(planta || {}) });
  const [erros, setErros] = useState({});

  const alterar = (campo) => (e) => {
    setDados((atual) => ({ ...atual, [campo]: e.target.value }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const enviar = (e) => {
    e.preventDefault();
    const novosErros = validar(dados);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    onSalvar({
      ...dados,
      nomeComum: dados.nomeComum.trim(),
      nomeCientifico: dados.nomeCientifico.trim(),
      familia: dados.familia.trim(),
      imagemUrl: dados.imagemUrl.trim(),
      descricao: dados.descricao.trim(),
      quantidade: Number(dados.quantidade),
    });
  };

  return (
    <div
      className="modal-fundo"
      role="dialog"
      aria-modal="true"
      aria-label="Formulário de planta"
    >
      <form className="modal form" onSubmit={enviar} noValidate>
        <h2>{editando ? "Editar planta" : "Nova planta"}</h2>

        <CampoBase
          erros={erros}
          campo="nomeComum"
          rotulo="Nome comum"
          obrigatorio
        >
          <input value={dados.nomeComum} onChange={alterar("nomeComum")} />
        </CampoBase>

        <CampoBase
          erros={erros}
          campo="nomeCientifico"
          rotulo="Nome científico"
          obrigatorio
        >
          <input
            value={dados.nomeCientifico}
            onChange={alterar("nomeCientifico")}
          />
        </CampoBase>

        <CampoBase erros={erros} campo="familia" rotulo="Família">
          <input value={dados.familia} onChange={alterar("familia")} />
        </CampoBase>

        <div className="linha">
          <CampoBase erros={erros} campo="tipo" rotulo="Tipo" obrigatorio>
            <select value={dados.tipo} onChange={alterar("tipo")}>
              <option value="">Selecione…</option>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </CampoBase>
          <CampoBase
            erros={erros}
            campo="quantidade"
            rotulo="Quantidade"
            obrigatorio
          >
            <input
              type="number"
              min="0"
              step="1"
              value={dados.quantidade}
              onChange={alterar("quantidade")}
            />
          </CampoBase>
        </div>

        <div className="linha">
          <CampoBase erros={erros} campo="luminosidade" rotulo="Luminosidade">
            <select
              value={dados.luminosidade}
              onChange={alterar("luminosidade")}
            >
              <option value="">Não informada</option>
              {LUMINOSIDADES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </CampoBase>
          <CampoBase erros={erros} campo="rega" rotulo="Frequência de rega">
            <select value={dados.rega} onChange={alterar("rega")}>
              <option value="">Não informada</option>
              {REGAS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </CampoBase>
        </div>

        <CampoBase erros={erros} campo="imagemUrl" rotulo="URL da imagem">
          <input
            type="url"
            placeholder="https://…"
            value={dados.imagemUrl}
            onChange={alterar("imagemUrl")}
          />
        </CampoBase>

        <CampoBase
          erros={erros}
          campo="descricao"
          rotulo={`Descrição (${dados.descricao.length}/500)`}
        >
          <textarea
            rows="4"
            value={dados.descricao}
            onChange={alterar("descricao")}
          />
        </CampoBase>

        <div className="form-actions">
          <button
            type="button"
            className="btn"
            onClick={onCancelar}
            disabled={salvando}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando
              ? "Salvando…"
              : editando
                ? "Salvar alterações"
                : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
