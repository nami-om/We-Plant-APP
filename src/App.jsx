import { useCallback, useEffect, useMemo, useState } from "react";
import {
  atualizarPlanta,
  criarPlanta,
  excluirPlanta,
  getId,
  listarPlantas,
} from "./services/plantasService.js";
import SearchBar from "./componentes/SearchBar.jsx";
import PlantList from "./componentes/PlantList.jsx";
import PlantForm from "./componentes/PlantForm.jsx";
import ConfirmDialog from "./componentes/ConfirmDialog.jsx";
import Toast from "./componentes/Toast.jsx";
import InstallButton from "./componentes/InstallButton.jsx";

const normalizar = (texto = "") =>
  texto.toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function App() {
  const [plantas, setPlantas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");

  const [formAberto, setFormAberto] = useState(false);
  const [plantaEmEdicao, setPlantaEmEdicao] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [plantaParaExcluir, setPlantaParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagem, setMensagem] = useState(null);

  const avisar = useCallback(
    (tipoMsg, texto) => setMensagem({ tipo: tipoMsg, texto }),
    [],
  );

  useEffect(() => {
    if (!mensagem) return undefined;
    const timer = setTimeout(() => setMensagem(null), 5000);
    return () => clearTimeout(timer);
  }, [mensagem]);

  // Busca a lista na API (fonte da verdade). Chamada no início e após cada operação.
  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setPlantas(await listarPlantas());
      setErroCarga("");
    } catch (erro) {
      setErroCarga(erro.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const plantasFiltradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    return plantas
      .filter((p) => !tipo || p.tipo === tipo)
      .filter(
        (p) =>
          !termo ||
          [p.nomeComum, p.nomeCientifico, p.familia].some((campo) =>
            normalizar(campo).includes(termo),
          ),
      )
      .sort((a, b) =>
        (a.nomeComum || "").localeCompare(b.nomeComum || "", "pt-BR"),
      );
  }, [plantas, busca, tipo]);

  const abrirNovo = () => {
    setPlantaEmEdicao(null);
    setFormAberto(true);
  };

  const abrirEdicao = (planta) => {
    setPlantaEmEdicao(planta);
    setFormAberto(true);
  };

  const fecharForm = () => {
    setFormAberto(false);
    setPlantaEmEdicao(null);
  };

  const salvar = async (dados) => {
    setSalvando(true);
    try {
      if (plantaEmEdicao) {
        await atualizarPlanta(getId(plantaEmEdicao), dados);
        avisar("sucesso", `“${dados.nomeComum}” foi atualizada com sucesso.`);
      } else {
        await criarPlanta(dados);
        avisar("sucesso", `“${dados.nomeComum}” foi cadastrada com sucesso.`);
      }
      fecharForm();
      await carregar();
    } catch (erro) {
      avisar("erro", `Não foi possível salvar: ${erro.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await excluirPlanta(getId(plantaParaExcluir));
      avisar("sucesso", `“${plantaParaExcluir.nomeComum}” foi excluída.`);
      setPlantaParaExcluir(null);
      await carregar();
    } catch (erro) {
      avisar("erro", `Não foi possível excluir: ${erro.message}`);
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="app">
      <header className="topo">
        <div>
          <h1>🌿 We Plant</h1>
          <p>Inventário e enciclopédia de plantas</p>
        </div>
        <div className="topo-acoes">
          <InstallButton />
          <button type="button" className="btn btn-primary" onClick={abrirNovo}>
            + Nova planta
          </button>
        </div>
      </header>

      <main>
        {erroCarga && (
          <div className="aviso aviso-erro">
            <span>{erroCarga}</span>
            <button type="button" className="btn" onClick={carregar}>
              Tentar novamente
            </button>
          </div>
        )}

        <SearchBar
          busca={busca}
          onBusca={setBusca}
          tipo={tipo}
          onTipo={setTipo}
        />

        {!carregando && !erroCarga && (
          <p className="contagem">
            {plantasFiltradas.length} de {plantas.length} planta(s)
          </p>
        )}

        {!erroCarga && (
          <PlantList
            plantas={plantasFiltradas}
            carregando={carregando}
            totalGeral={plantas.length}
            onEditar={abrirEdicao}
            onExcluir={setPlantaParaExcluir}
          />
        )}
      </main>

      {formAberto && (
        <PlantForm
          planta={plantaEmEdicao}
          salvando={salvando}
          onSalvar={salvar}
          onCancelar={fecharForm}
        />
      )}

      {plantaParaExcluir && (
        <ConfirmDialog
          planta={plantaParaExcluir}
          excluindo={excluindo}
          onConfirmar={confirmarExclusao}
          onCancelar={() => setPlantaParaExcluir(null)}
        />
      )}

      <Toast mensagem={mensagem} onFechar={() => setMensagem(null)} />
    </div>
  );
}
