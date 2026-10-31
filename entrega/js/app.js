 const api = GepisegAPI.criar();

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  try { localStorage.setItem('tema', tema); } catch (e) {}
}

function trocarTema() {
  const atual = document.documentElement.getAttribute('data-theme');
  aplicarTema(atual === 'light' ? 'dark' : 'light');
}

async function mostrarArtigos() {
  const aviso = document.getElementById('aviso');
  const lista = document.getElementById('lista');
  const busca = document.getElementById('busca').value;

  try {
    const resposta = await api.artigos.listar({ q: busca, porPagina: 30 });


    aviso.innerHTML = `<div class="alert alert-info">${resposta.info.count} artigo(s) encontrado(s)</div>`;

    lista.innerHTML = resposta.results.map(artigo => `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100" onclick="abrirArtigo(${artigo.id})">
          <img src="${artigo.imagem}" class="card-img-top">
          <div class="card-body">
            <span class="badge bg-primary">${artigo.tema}</span>
            <h5 class="card-title mt-2">${artigo.titulo}</h5>
            <p class="text-muted small mb-0">${artigo.autorPrincipal.nome} · ${artigo.ano} · ${artigo.citacoes} citações</p>
          </div>
        </div>
      </div>`).join('');
  } catch (erro) {
    aviso.innerHTML = '<div class="alert alert-warning">Nenhum artigo encontrado.</div>';
    lista.innerHTML = '';
  }
}

async function abrirArtigo(id) {
  const artigo = await api.artigos.porId(id);

  document.getElementById('modalTitulo').textContent = artigo.titulo;
  document.getElementById('modalCorpo').innerHTML = `
    <p><strong>Autores:</strong> ${artigo.autores.map(a => a.nome).join(', ')}</p>
    <p><strong>Publicado em:</strong> ${artigo.veiculo} (${artigo.ano})</p>
    <p>${artigo.palavrasChave.map(p => `<span class="badge bg-secondary">${p}</span>`).join(' ')}</p>
    <p>${artigo.resumo}</p>`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modal')).show();
}

let temaSalvo = 'dark';
try { temaSalvo = localStorage.getItem('tema') || 'dark'; } catch (e) {}
aplicarTema(temaSalvo);

mostrarArtigos();
