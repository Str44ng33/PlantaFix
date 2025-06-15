import { useState } from 'react';

const doencasEPlantas={
"Artrite":"Salix alba","Asma":"Eucalyptus globulus","Câncer":"Withania somnifera","Catarro":"Tussilago farfara","Diabetes":"Gymnema sylvestre","Insônia":"Valeriana officinalis","Dor de cabeça":"Mentha piperita","Hipertensão":"Allium sativum","Gripes":"Echinacea purpurea","Resfriado":"Echinacea purpurea","Dores musculares":"Arnica montana","Depressão":"Hypericum perforatum","Gastrite":"Zingiber officinale","Problemas digestivos":"Cuminum cyminum","Tensão nervosa":"Lavandula angustifolia","Úlcera gástrica":"Cichorium intybus","Cólica menstrual":"Angelica sinensis","Candidíase":"Cucumis sativus","Colesterol alto":"Panax ginseng","Dores de estômago":"Matricaria chamomilla","Dor de dente":"Syzygium aromaticum","Infecções urinárias":"Vaccinium macrocarpon","Problemas respiratórios":"Thymus vulgaris","Enxaqueca":"Tanacetum parthenium","Azia":"Cucumis melo","Queimaduras":"Aloe vera","Anemia":"Trifolium pratense","Infecção de garganta":"Salvia officinalis","Dores nas articulações":"Boswellia serrata","Bronquite":"Althaea officinalis","Eczema":"Calendula officinalis","Câncer de fígado":"Andrographis paniculata","Hemorroidas":"Hamamelis virginiana","Vermes intestinais":"Chenopodium ambrosioides","Diarreia":"Coptis chinensis","Constipação":"Rheum officinale","Cálculos renais":"Asparagus racemosus","Hipotireoidismo":"Coleus forskohlii","Pele seca":"Cocos nucifera","Infecção de ouvido":"Echinacea purpurea","Amigdalite":"Melissa officinalis","Hemorragias":"Achillea millefolium","Alzheimer":"Ginkgo biloba","Cálculos biliares":"Taraxacum officinale","Tontura":"Zingiber officinale","Náuseas":"Mentha spicata","Febre":"Tilia cordata","Hipoglicemia":"Momordica charantia","Fadiga":"Eleutherococcus senticosus","Infecção de pele":"Chamaecyparis obtusa","Tosse":"Cinnamomum verum","Queda de cabelo":"Trigonella foenum-graecum","Alergia":"Nicotiana tabacum","Desidratação":"Cucumis sativus","Úlcera péptica":"Myrtus communis","Cistos ovarianos":"Vitex agnus-castus","Pneumonia":"Eucalyptus citriodora","Aftas":"Sanguinaria canadensis","Rinite alérgica":"Allium cepa","Pedra nos rins":"Tribulus terrestris","Acne":"Azadirachta indica","Psoríase":"Vitis vinifera","Hepatite":"Silybum marianum","Alergias alimentares":"Bromelain","Varizes":"Ruscus aculeatus","Obesidade":"Camellia sinensis","Candidíase oral":"Cinnamomum zeylanicum","Anorexia":"Glycyrrhiza glabra","Gripe suína":"Eucalyptus globulus","Tensão alta":"Hibiscus sabdariffa","Dores nas costas":"Capsicum annuum","Cistite":"Orthosiphon aristatus","Infecções bacterianas":"Berberis vulgaris","Úlceras na boca":"Carya ovata","Gota":"Prunus cerasus","Anemia ferropriva":"Trigonella foenum-graecum","Vermes":"Cucurbita pepo","Câncer de mama":"Curcuma longa","Câncer de pulmão":"Crataegus monogyna","Espirros":"Urtica dioica","Rugas":"Hibiscus rosa-sinensis","Lúpus":"Corydalis yanhusuo","Hipotensão":"Panax ginseng","Estresse":"Passiflora incarnata","Sinusite":"Cinnamomum zeylanicum","Hemorroidas internas":"Aesculus hippocastanum","Malária":"Artemisia annua","Hipocalcemia":"Ostrea edulis","Síndrome do intestino irritável":"Mentha piperita","Cálculos vesiculares":"Chanca Piedra","Dor crônica":"Cannabis sativa","Náusea e vômito":"Cannabis sativa","Epilepsia":"Cannabis sativa","Ansiedade":"Cannabis sativa","PTSD":"Cannabis sativa","Glaucoma":"Cannabis sativa","Esclerose múltipla":"Cannabis sativa","Distúrbios do sono":"Cannabis sativa"
}

export default function PlantaFinder() {
  const normalize = str =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const [doenca, setDoenca] = useState('');
  const [planta, setPlanta] = useState('');
  const [resultado, setResultado] = useState('');
  const [species, setSpecies] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [artigo, setArtigo] = useState({ autor: '', titulo: '', link: '' });
  const [mostrarMais, setMostrarMais] = useState(false);
  const [pesquisa, setPesquisa] = useState('');

  const entries = Object.entries(doencasEPlantas);
  const limit = mostrarMais ? entries.length : 24;
  const doencasFiltradas = entries.filter(
    ([nome]) => normalize(nome).includes(normalize(pesquisa))
  );

  const fetchSpecies = async name => {
    try {
      const res = await fetch(
        `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(
          name
        )}`
      );
      const json = await res.json();
      return Array.isArray(json.usageKey)
        ? json.usageKey.map(k => ({ name: k, status: 'UNKNOWN' }))
        : json.usageKey
        ? [{ name: json.canonicalName, status: json.status }]
        : [];
    } catch {
      return [];
    }
  };

  const wikiExtract = async (lang, name) => {
    const res = await fetch(
      `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&prop=extracts&exintro=true&explaintext=true&format=json&origin=*`
    );
    const json = await res.json();
    const page = json.query.pages[Object.keys(json.query.pages)[0]];
    if (!page?.extract) throw new Error();
    return page.extract;
  };

  const translatePT = async text => {
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const json = await res.json();
      return json[0].map(seg => seg[0]).join('');
    } catch {
      return text;
    }
  };

  const fetchDescription = async name => {
    for (const lang of ['pt', 'es', 'en']) {
      try {
        const txt = await wikiExtract(lang, name);
        return lang === 'pt' ? txt : await translatePT(txt);
      } catch {}
    }
    return 'Descrição não disponível.';
  };

const fetchPubmed = async term => {
  try {
    const searchUrl = 
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?` +
      `db=pubmed&term=${encodeURIComponent(term)}&retmax=2&retmode=json`;
    const sr = await fetch(searchUrl);
    const { esearchresult } = await sr.json();
    const id = esearchresult.idlist[0];
    if (!id) throw new Error('Nenhum resultado encontrado');

    const summaryUrl = 
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?` +
      `db=pubmed&id=${id}&retmode=json`;
    const su = await fetch(summaryUrl);
    const jsu = await su.json();
    const doc = jsu.result[id];

    const autor = doc.authors?.[0]?.name || 'Desconhecido';
    const tituloEn = doc.title;
    const link = `https://pubmed.ncbi.nlm.nih.gov/${id}/`;

    const translateUrl = 
      `https://translate.googleapis.com/translate_a/single?` +
      `client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(tituloEn)}`;
    const tr = await fetch(translateUrl);
    const jtr = await tr.json();
    const tituloPt = jtr[0].map(seg => seg[0]).join('');

    return { autor, titulo: tituloPt, link };
  } catch (e) {
    console.warn('Erro no fetchPubmed:', e);
    return { autor: '', titulo: '', link: '' };
  }
};

  const handleBuscar = async () => {
    const key = normalize(doenca.trim());
    const found = Object.keys(doencasEPlantas).find(k => normalize(k) === key);
    const plantName = found ? doencasEPlantas[found] : null;

    if (!plantName) {
      setResultado('Não encontramos algo pra isso.');
      setPlanta('');
      setSpecies([]);
      setDescricao('');
      setArtigo({ autor: '', titulo: '', link: '' });
      return;
    }

    setPlanta(plantName);
    setResultado(`Planta recomendada pra ${found}: ${plantName}`);
    const sp = await fetchSpecies(plantName);
    setSpecies(Array.isArray(sp) ? sp : []);
    setDescricao(await fetchDescription(plantName));
    setArtigo(await fetchPubmed(plantName));
  };

  return (
    <div
      className="container"
      style={{
        padding: 20,
        fontFamily: 'M PLUS Code Latin, monospace',
        backgroundColor: 'black',
        color: 'white',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* logo + título */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <img
          src="https://i.imgur.com/2DgMrXb.png"
          alt="Logo Plantafix"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            filter: 'drop-shadow(0 0 8px #39FF14)',
          }}
        />
        <h1 style={{ color: '#39FF14', fontSize: '2.5rem', margin: '10px 0 0' }}>
          Plantafix
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#777',
            textAlign: 'center',
            maxWidth: '600px',
            marginTop: '8px',
          }}
        >
	Este site é um projeto de feira de ciências,
	no qual o usuário informa a doença ou sintoma que possui
	e o site retornará uma planta que pode curar ou tratar essa condição.
	Nossas fontes de pesquisa são a Wikipédia para a parte de descrição 
	e a PubMed para artigos científicos.		
        </p>
      </div>

      {/* busca */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="O que você quer tratar/curar?"
          value={doenca} // Nossa, vc realmente tá olhando o nosso código
          onChange={e => setDoenca(e.target.value)}
          style={{
            padding: 8,
            width: 300,
            borderRadius: 8,
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #39FF14',
          }}
        />
        <button
          onClick={handleBuscar}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            backgroundColor: '#39FF14',
            border: 'none',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Buscar
        </button>
      </div>

      {/* pesquisa */}
      <input
        type="text"
        placeholder="Pesquise pela sua condição de saúde"
        value={pesquisa}
        onChange={e => setPesquisa(e.target.value)}
        style={{
          marginTop: 20,
          padding: 8,
          width: 300,
          borderRadius: 8,
          backgroundColor: '#333',
          color: 'white',
          border: '1px solid #39FF14',
        }}
      />

      {/* resultado */}
      {resultado && (
        <div style={{ marginTop: 20, textAlign: 'left' }}>
          <p>{resultado}</p>
          {species?.length > 0 && (
            <>
              <h3 style={{ color: '#39FF14' }}>Espécie encontrada</h3>
              <ul>
                {species.map((s, i) => (
                  <li key={i}>
                    <strong>{s.name}</strong> ({s.status})
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3 style={{ color: '#39FF14', marginTop: 20 }}>Descrição: Wikipédia</h3>
          <p>{descricao}</p>
          {artigo.titulo && (
            <>
              <h3 style={{ color: '#39FF14', marginTop: 20 }}>
                Artigo científico: PubMed
              </h3>
              <p>
                <strong>Autor:</strong> {artigo.autor}
              </p>
              <p>
                <strong>Título:</strong> {artigo.titulo}
              </p>
              <a
                href={artigo.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'blue' }}
              >
                Ler no PubMed
              </a>
            </>
          )}
          {planta && (
            <>
              <h3 style={{ color: '#39FF14', marginTop: 20 }}>Links úteis</h3>
              <a
                href="https://www.google.com/maps/search/plantas+perto+de+mim"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', marginTop: 8, color: '#39FF14' }}
              >
                ➞ Lugares perto de mim pra adquirir plantas
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=como+cultivar+${encodeURIComponent(
                  planta
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', marginTop: 8, color: '#39FF14' }}
              >
                ➞ Como cultivar {planta}
              </a>
            </>
          )}
        </div>
      )}

      {/* dicionário */}
      <div
        style={{
          marginTop: 40,
          borderTop: '1px solid #39FF14',
          paddingTop: 20,
        }}
      >
        <h2 style={{ color: '#39FF14' }}>Dicionário de Plantas</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 10,
          }}
        >
          {doencasFiltradas.slice(0, limit).map(([d, p]) => (
            <div key={d} style={{ color: 'white' }}>
              <strong>{d}</strong>: {p}
            </div>
          ))}
        </div>
        {entries.length > 24 && (
          <button
            onClick={() => setMostrarMais(!mostrarMais)}
            style={{
              marginTop: 20,
              padding: '8px 16px',
              borderRadius: 8,
              backgroundColor: '#39FF14',
              border: 'none',
              color: 'black',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {mostrarMais ? 'Mostrar menos' : 'Mostrar mais'}
          </button>
        )}
      </div>

      {/* footer */}
      <footer
        style={{
          marginTop: 40,
          padding: '20px 0',
          textAlign: 'center',
          color: '#777',
          fontSize: '0.9rem',
        }}
      >
        este site foi feito pelos alunos do CMM: Matheus Mendonça, Thalita Pina e Heitor Rocha
        <br />
        <a
          href="https://github.com/Str44ng33/PlantaFix"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#39FF14', textDecoration: 'none' }}
        >
          ❖ GitHub do projeto
        </a>
      </footer>
    </div>
  );
}
