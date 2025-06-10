import { useState } from 'react';

const doencasEPlantas = {
"Artrite": "Salix alba", "Asma": "Eucalyptus globulus", "Câncer": "Withania somnifera", "Catarro": "Tussilago farfara", "Diabetes": "Gymnema sylvestre", "Insônia": "Valeriana officinalis", "Dor de cabeça": "Mentha piperita", "Hipertensão": "Allium sativum", "Gripes": "Echinacea purpurea", "Resfriado": "Echinacea purpurea", "Dores musculares": "Arnica montana", "Depressão": "Hypericum perforatum", "Gastrite": "Zingiber officinale", "Problemas digestivos": "Cuminum cyminum", "Tensão nervosa": "Lavandula angustifolia", "Úlcera gástrica": "Cichorium intybus", "Cólica menstrual": "Angelica sinensis", "Candidíase": "Cucumis sativus", "Colesterol alto": "Panax ginseng", "Dores de estômago": "Matricaria chamomilla", "Dor de dente": "Syzygium aromaticum", "Infeções urinárias": "Vaccinium macrocarpon", "Problemas respiratórios": "Thymus vulgaris", "Enxaqueca": "Tanacetum parthenium", "Azia": "Cucumis melo", "Queimaduras": "Aloe vera", "Anemia": "Trifolium pratense", "Infecção de garganta": "Salvia officinalis", "Dores nas articulações": "Boswellia serrata", "Bronquite": "Althaea officinalis", "Eczema": "Calendula officinalis", "Câncer de fígado": "Andrographis paniculata", "Hemorroidas": "Hamamelis virginiana", "Vermes intestinais": "Chenopodium ambrosioides", "Diarreia": "Coptis chinensis", "Constipação": "Rheum officinale", "Cálculos renais": "Asparagus racemosus", "Hipotireoidismo": "Coleus forskohlii", "Pele seca": "Cocos nucifera", "Infecção de ouvido": "Echinacea purpurea", "Amigdalite": "Melissa officinalis", "Hemorragias": "Achillea millefolium", "Alzheimer": "Ginkgo biloba", "Cálculos biliares": "Taraxacum officinale", "Tontura": "Zingiber officinale", "Náuseas": "Mentha spicata", "Febre": "Tilia cordata", "Hipoglicemia": "Momordica charantia", "Fadiga": "Eleutherococcus senticosus", "Infecção de pele": "Chamaecyparis obtusa", "Tosse": "Cinnamomum verum", "Queda de cabelo": "Trigonella foenum-graecum", "Alergia": "Nicotiana tabacum", "Desidratação": "Cucumis sativus", "Úlcera péptica": "Myrtus communis", "Cistos ovarianos": "Vitex agnus-castus", "Pneumonia": "Eucalyptus citriodora", "Aftas": "Sanguinaria canadensis", "Rinite alérgica": "Allium cepa", "Pedra nos rins": "Tribulus terrestris", "Acne": "Azadirachta indica", "Dores de garganta": "Zingiber officinale", "Psoríase": "Vitis vinifera", "Hepatite": "Silybum marianum", "Alergias alimentares": "Bromelain", "Cálculos renais": "Phyllanthus niruri", "Varizes": "Ruscus aculeatus", "Obesidade": "Camellia sinensis", "Candidíase oral": "Cinnamomum zeylanicum", "Anorexia": "Glycyrrhiza glabra", "Gripe suína": "Eucalyptus globulus", "Tensão alta": "Hibiscus sabdariffa", "Dores nas costas": "Capsicum annuum", "Cistite": "Orthosiphon aristatus", "Infecções bacterianas": "Berberis vulgaris", "Úlceras na boca": "Carya ovata", "Gota": "Prunus cerasus", "Anemia ferropriva": "Trigonella foenum-graecum", "Vermes": "Cucurbita pepo", "Câncer de mama": "Curcuma longa", "Câncer de pulmão": "Crataegus monogyna", "Espirros": "Urtica dioica", "Rugas": "Hibiscus rosa-sinensis", "Lúpus": "Corydalis yanhusuo", "Acne": "Camellia sinensis", "Alergia alimentar": "Allium sativum", "Hipotensão": "Panax ginseng", "Estresse": "Passiflora incarnata", "Sinusite": "Cinnamomum zeylanicum", "Aftas": "Calendula officinalis", "Hemorroidas internas": "Aesculus hippocastanum", "Malária": "Artemisia annua", "Hipocalcemia": "Ostrea edulis", "Problemas digestivos": "Trigonella foenum-graecum", "Dores no corpo": "Capsicum annuum", "Hemorragias nasais": "Achillea millefolium", "Laringite": "Althaea officinalis", "Câncer de cólon": "Curcuma longa", "Sindrome do intestino irritável": "Mentha piperita", "Obesidade": "Citrus sinensis", "Cálculos vesiculares": "Chanca Piedra"
};
export default function PlantaFinder() {
  const [doenca, setDoenca] = useState('');
  const [planta, setPlanta] = useState('');
  const [resultado, setResultado] = useState('');
  const [species, setSpecies] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [mostrarMais, setMostrarMais] = useState(false);
  const [pesquisa, setPesquisa] = useState('');

  const entries = Object.entries(doencasEPlantas);
  const limit = mostrarMais ? entries.length : 24;
  const doencasFiltradas = entries.filter(([nome]) =>
    nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const fetchSpecies = async (name) => {
    try {
      const res = await fetch(
        `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}`
      );
      const json = await res.json();
      return json.usageKey
        ? [{ name: json.canonicalName, status: json.status }]
        : [];
    } catch {
      return [];
    }
  };

  const tryWikiPT = async (name) => {
    const res = await fetch(
      `https://pt.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&prop=extracts&exintro=true&explaintext=true&format=json&origin=*`
    );
    const json = await res.json();
    const page = json.query.pages[Object.keys(json.query.pages)[0]];
    if (!page?.extract) throw new Error();
    return page.extract;
  };

  const tryWikiES = async (name) => {
    const res = await fetch(
      `https://es.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&prop=extracts&exintro=true&explaintext=true&format=json&origin=*`
    );
    const json = await res.json();
    const page = json.query.pages[Object.keys(json.query.pages)[0]];
    if (!page?.extract) throw new Error();
    return page.extract;
<<<<<<< HEAD
=======
  };

  const tryWikiEN = async (name) => {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&prop=extracts&exintro=true&explaintext=true&format=json&origin=*`
    );
    const json = await res.json();
    const page = json.query.pages[Object.keys(json.query.pages)[0]];
    if (!page?.extract) throw new Error();
    return page.extract;
>>>>>>> a174b96 (versão 1.9.3)
  };

  const tryWikiEN = async (name) => {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&prop=extracts&exintro=true&explaintext=true&format=json&origin=*`
    );
    const json = await res.json();
    const page = json.query.pages[Object.keys(json.query.pages)[0]];
    if (!page?.extract) throw new Error();
    return page.extract;
  };

  // único fetchDescription com fallback em PT → ES → EN
  const fetchDescription = async (name) => {
    const fontes = [tryWikiPT, tryWikiES, tryWikiEN];
    for (const f of fontes) {
      try {
        const text = await f(name);
        if (text) return text;
      } catch {}
    }
    return 'Descrição não disponível.';
  };

  const handleBuscar = async () => {
    const key = doenca.trim().toLowerCase();
    const found = Object.keys(doencasEPlantas).find(
      (k) => k.toLowerCase() === key
    );
    const plantName = found ? doencasEPlantas[found] : null;

    if (!plantName) {
      setResultado('Não encontramos algo para isso.');
      setPlanta('');
      setSpecies([]);
      setDescricao('');
      return;
    }

    setPlanta(plantName);
    setResultado(`Planta recomendada pra ${found}: ${plantName}`);
    setSpecies(await fetchSpecies(plantName));
    setDescricao(await fetchDescription(plantName));
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
      {/* Logo circular + título */}
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
<<<<<<< HEAD
=======
        <p style={{ fontSize: '0.9rem', color: '#777', textAlign: 'center', maxWidth: '600px', marginTop: '8px' }}>
          Este site é um projeto de feira de ciências, no qual o usuário informa a doença ou sintoma que possui e o site retornará uma planta que pode curar ou tratar essa condição. Nossas fontes de pesquisa são da Wikipédia, na parte de descrição.
        </p>
>>>>>>> a174b96 (versão 1.9.3)
      </div>

      {/* Busca */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Oque você quer tratar/curar?"
          value={doenca}
          onChange={(e) => setDoenca(e.target.value)}
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

      {/* Pesquisa no dicionário */}
      <input
        type="text"
        placeholder="Pesquise por seu problema."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
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

      {/* Resultado */}
      {resultado && (
        <div style={{ marginTop: 20, textAlign: 'left' }}>
          <p>{resultado}</p>
          {species.length > 0 && (
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
          <h3 style={{ color: '#39FF14', marginTop: 20 }}>Descrição</h3>
          <p>{descricao}</p>
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

      {/* Dicionário de Plantas */}
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
            textAlign: 'left',
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
<<<<<<< HEAD
{/* Footer */}
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
    style={{ color: '#39FF14', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}
  >
    ❖ GitHub do projeto
  </a>
</footer>

=======

      {/* Footer */}
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
          style={{ color: '#39FF14', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}
        >
          ❖ GitHub do projeto
        </a>
      </footer>
    </div>
  );
}
