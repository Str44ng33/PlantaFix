import { useState } from 'react';
import logo from './assets/logo.png';

const doencasEPlantas = {
"Artrite": "Salix alba", "Asma": "Eucalyptus globulus", "Câncer": "Withania somnifera", "Catarro": "Tussilago farfara", "Diabetes": "Gymnema sylvestre", "Insônia": "Valeriana officinalis", "Dor de cabeça": "Mentha piperita", "Hipertensão": "Allium sativum", "Gripes": "Echinacea purpurea", "Dores musculares": "Arnica montana", "Depressão": "Hypericum perforatum", "Gastrite": "Zingiber officinale", "Problemas digestivos": "Cuminum cyminum", "Tensão nervosa": "Lavandula angustifolia", "Úlcera gástrica": "Cichorium intybus", "Cólica menstrual": "Angelica sinensis", "Candidíase": "Cucumis sativus", "Colesterol alto": "Panax ginseng", "Dores de estômago": "Matricaria chamomilla", "Dor de dente": "Syzygium aromaticum", "Infeções urinárias": "Vaccinium macrocarpon", "Problemas respiratórios": "Thymus vulgaris", "Enxaqueca": "Tanacetum parthenium", "Azia": "Cucumis melo", "Queimaduras": "Aloe vera", "Anemia": "Trifolium pratense", "Infecção de garganta": "Salvia officinalis", "Dores nas articulações": "Boswellia serrata", "Bronquite": "Althaea officinalis", "Eczema": "Calendula officinalis", "Câncer de fígado": "Andrographis paniculata", "Hemorroidas": "Hamamelis virginiana", "Vermes intestinais": "Chenopodium ambrosioides", "Diarreia": "Coptis chinensis", "Constipação": "Rheum officinale", "Cálculos renais": "Asparagus racemosus", "Hipotireoidismo": "Coleus forskohlii", "Pele seca": "Cocos nucifera", "Infecção de ouvido": "Echinacea purpurea", "Amigdalite": "Melissa officinalis", "Hemorragias": "Achillea millefolium", "Alzheimer": "Ginkgo biloba", "Cálculos biliares": "Taraxacum officinale", "Tontura": "Zingiber officinale", "Náuseas": "Mentha spicata", "Febre": "Tilia cordata", "Hipoglicemia": "Momordica charantia", "Fadiga": "Eleutherococcus senticosus", "Infecção de pele": "Chamaecyparis obtusa", "Tosse": "Cinnamomum verum", "Queda de cabelo": "Trigonella foenum-graecum", "Alergia": "Nicotiana tabacum", "Desidratação": "Cucumis sativus", "Úlcera péptica": "Myrtus communis", "Cistos ovarianos": "Vitex agnus-castus", "Pneumonia": "Eucalyptus citriodora", "Aftas": "Sanguinaria canadensis", "Rinite alérgica": "Allium cepa", "Pedra nos rins": "Tribulus terrestris", "Acne": "Azadirachta indica", "Dores de garganta": "Zingiber officinale", "Psoríase": "Vitis vinifera", "Hepatite": "Silybum marianum", "Alergias alimentares": "Bromelain", "Cálculos renais": "Phyllanthus niruri", "Varizes": "Ruscus aculeatus", "Obesidade": "Camellia sinensis", "Candidíase oral": "Cinnamomum zeylanicum", "Anorexia": "Glycyrrhiza glabra", "Gripe suína": "Eucalyptus globulus", "Tensão alta": "Hibiscus sabdariffa", "Dores nas costas": "Capsicum annuum", "Cistite": "Orthosiphon aristatus", "Infecções bacterianas": "Berberis vulgaris", "Úlceras na boca": "Carya ovata", "Gota": "Prunus cerasus", "Anemia ferropriva": "Trigonella foenum-graecum", "Vermes": "Cucurbita pepo", "Câncer de mama": "Curcuma longa", "Câncer de pulmão": "Crataegus monogyna", "Espirros": "Urtica dioica", "Rugas": "Hibiscus rosa-sinensis", "Lúpus": "Corydalis yanhusuo", "Acne": "Camellia sinensis", "Alergia alimentar": "Allium sativum", "Hipotensão": "Panax ginseng", "Estresse": "Passiflora incarnata", "Sinusite": "Cinnamomum zeylanicum", "Aftas": "Calendula officinalis", "Hemorroidas internas": "Aesculus hippocastanum", "Malária": "Artemisia annua", "Hipocalcemia": "Ostrea edulis", "Problemas digestivos": "Trigonella foenum-graecum", "Dores no corpo": "Capsicum annuum", "Hemorragias nasais": "Achillea millefolium", "Laringite": "Althaea officinalis", "Câncer de cólon": "Curcuma longa", "Sindrome do intestino irritável": "Mentha piperita", "Obesidade": "Citrus sinensis", "Cálculos vesiculares": "Chanca Piedra"
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
      return json.usageKey ? [{ name: json.canonicalName, status: json.status }] : [];
    } catch {
      return [];
    }
  };

  const traduzirParte = async (parte) => {
    const res = await fetch('https://translate.argosopentech.com/translate', {
      method: 'POST',
      body: JSON.stringify({ q: parte, source: 'auto', target: 'pt', format: 'text' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (json.translatedText) return json.translatedText;
    throw new Error();
  };

  const traduzirParteFallback = async (parte) => {
    try {
      return await traduzirParte(parte);
    } catch {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(parte)}&langpair=en|pt`
      );
      const json = await res.json();
      return json.responseData.translatedText || parte;
    }
  };

  const traduzirTextoGrande = async (texto) => {
    const blocos = [];
    for (let i = 0; i < texto.length; i += 500) {
      blocos.push(texto.slice(i, i + 500));
    }
    const trads = [];
    for (const bloco of blocos) {
      trads.push(await traduzirParteFallback(bloco));
    }
    return trads.join(' ');
  };

  const tryEOL = async (name) => {
    const searchRes = await fetch(
      `https://eol.org/api/search/1.0.json?q=${encodeURIComponent(name)}&exact=true`
    );
    const searchJson = await searchRes.json();
    if (!searchJson.results?.length) throw new Error('EOL não encontrou');
    const pageId = searchJson.results[0].id;
    const detailRes = await fetch(
      `https://eol.org/api/pages/1.0/${pageId}.json?details=true&languages=en`
    );
    const detailJson = await detailRes.json();
    const obj = detailJson.dataObjects?.find((o) => o.description);
    if (!obj?.description) throw new Error('EOL sem descrição');
    return traduzirTextoGrande(obj.description);
  };

  const tryOpenFarm = async (name) => {
    const res = await fetch(
      `https://openfarm.cc/api/v1/crops/?filter=${encodeURIComponent(name)}`
    );
    const json = await res.json();
    const crop = json.data?.[0]?.attributes;
    if (!crop?.description) throw new Error('OpenFarm sem descrição');
    return traduzirTextoGrande(crop.description);
  };

  const tryWikiEN = async (name) => {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&prop=extracts&exintro=true&explaintext=true&format=json&origin=*`
    );
    const json = await res.json();
    const page = json.query.pages[Object.keys(json.query.pages)[0]];
    if (!page?.extract) throw new Error('Wiki EN sem extract');
    return traduzirTextoGrande(page.extract);
  };

  const tryWikiES = async (name) => {
    const res = await fetch(
      `https://es.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        name
      )}&prop=extracts&exintro=true&explaintext=true&format=json&origin=*`
    );
    const json = await res.json();
    const page = json.query.pages[Object.keys(json.query.pages)[0]];
    if (!page?.extract) throw new Error('Wiki ES sem extract');
    return traduzirTextoGrande(page.extract);
  };

  const fetchDescription = async (name) => {
    const fontes = [tryEOL, tryOpenFarm, tryWikiEN, tryWikiES];
    const resultados = await Promise.allSettled(fontes.map(f => f(name)));
    for (const r of resultados) {
      if (r.status === 'fulfilled' && r.value) return r.value;
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
      setResultado('Não encontramos uma planta pra isso.');
      setPlanta('');
      setSpecies([]);
      setDescricao('');
      return;
    }

    setPlanta(plantName);
    setResultado(`Planta recomendada para ${found}: ${plantName}`);
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
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{ color: '#39FF14' }}>Plantafix</h1>
    <img
      src={process.env.PUBLIC_URL + '/logo.png'}
      alt="Logo"
      style={{
        height: 250,
        objectFit: 'contain',
      }}
    />
  </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Digite a doença aqui..."
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

      <input
        type="text"
        placeholder="Pesquise por uma doença..."
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
                ➞ Lugares perto de mim para adquirir plantas
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
    </div>
  );
}
