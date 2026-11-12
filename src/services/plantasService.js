// Toda a persistência das plantas fica aqui. Os componentes nunca acessam o
// localStorage diretamente: se o armazenamento mudar de novo, só este arquivo muda.
// As funções são assíncronas para manter a mesma interface de uma API.

const CHAVE = 'we-plant:plantas';

// Identificador de cada planta
export const getId = (planta) => planta?.id;

function gerarId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function ler() {
  let texto;
  try {
    texto = localStorage.getItem(CHAVE);
  } catch {
    throw new Error('Não foi possível acessar o armazenamento do navegador.');
  }
  if (!texto) return [];
  try {
    const dados = JSON.parse(texto);
    return Array.isArray(dados) ? dados : [];
  } catch {
    throw new Error('Os dados salvos estão corrompidos e não puderam ser lidos.');
  }
}

function gravar(plantas) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(plantas));
  } catch {
    throw new Error('Não foi possível salvar: o armazenamento do navegador está cheio ou bloqueado.');
  }
}

// Remove o id antes de gravar para ele nunca ser sobrescrito pelo formulário.
function semId(planta) {
  const dados = { ...planta };
  delete dados.id;
  return dados;
}

export async function listarPlantas() {
  return ler();
}

export async function criarPlanta(planta) {
  const plantas = ler();
  const nova = { ...semId(planta), id: gerarId() };
  gravar([...plantas, nova]);
  return nova;
}

export async function atualizarPlanta(id, planta) {
  const plantas = ler();
  if (!plantas.some((p) => getId(p) === id)) {
    throw new Error('Planta não encontrada. Ela pode ter sido excluída.');
  }
  const atualizada = { ...semId(planta), id };
  gravar(plantas.map((p) => (getId(p) === id ? atualizada : p)));
  return atualizada;
}

export async function excluirPlanta(id) {
  const plantas = ler();
  if (!plantas.some((p) => getId(p) === id)) {
    throw new Error('Planta não encontrada. Ela pode já ter sido excluída.');
  }
  gravar(plantas.filter((p) => getId(p) !== id));
}
