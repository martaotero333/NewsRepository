export type PopularSource = {
  name: string;
  url: string;
  scope: 'national' | 'international' | 'local';
  region: string;
};

export const popularSources: PopularSource[] = [
  { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', scope: 'national', region: 'España' },
  { name: '20minutos', url: 'https://www.20minutos.es/rss/', scope: 'national', region: 'España' },
  { name: 'ABC', url: 'https://www.abc.es/rss/feeds/abcPortada.xml', scope: 'national', region: 'España' },
  { name: 'elDiario.es', url: 'https://www.eldiario.es/rss/', scope: 'national', region: 'España' },
  { name: 'El Confidencial', url: 'https://rss.elconfidencial.com/espana/', scope: 'national', region: 'España' },
  { name: 'El Español', url: 'https://www.elespanol.com/rss/', scope: 'national', region: 'España' },
  { name: 'El Mundo', url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml', scope: 'national', region: 'España' },
  { name: 'Europa Press', url: 'https://www.europapress.es/rss/rss.aspx', scope: 'national', region: 'España' },

  { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', scope: 'international', region: 'Mundial' },
  { name: 'The Guardian World', url: 'https://www.theguardian.com/world/rss', scope: 'international', region: 'Mundial' },
  { name: 'The New York Times World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', scope: 'international', region: 'Mundial' },
  { name: 'NPR World', url: 'https://feeds.npr.org/1004/rss.xml', scope: 'international', region: 'Mundial' },
  { name: 'Deutsche Welle', url: 'https://rss.dw.com/rdf/rss-en-all', scope: 'international', region: 'Mundial' },
  { name: 'France 24', url: 'https://www.france24.com/en/rss', scope: 'international', region: 'Mundial' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', scope: 'international', region: 'Mundial' },
  { name: 'CBC World', url: 'https://www.cbc.ca/webfeed/rss/rss-world', scope: 'international', region: 'Mundial' },
  { name: 'Euronews', url: 'https://www.euronews.com/rss?format=xml', scope: 'international', region: 'Mundial' },
  { name: 'The Hindu World', url: 'https://www.thehindu.com/news/international/feeder/default.rss', scope: 'international', region: 'Mundial' },

  { name: 'El Mundo Madrid', url: 'https://www.elmundo.es/rss/madrid.xml', scope: 'local', region: 'Madrid' },
  { name: 'Ara', url: 'https://www.ara.cat/rss/', scope: 'local', region: 'Catalunya' },
  { name: 'VilaWeb', url: 'https://www.vilaweb.cat/feed/', scope: 'local', region: 'Catalunya' },
  { name: 'Diari de Tarragona', url: 'https://www.diaridetarragona.com/rss', scope: 'local', region: 'Catalunya' },
  { name: 'Diario de Sevilla', url: 'https://www.diariodesevilla.es/rss/', scope: 'local', region: 'Andalucía' },
  { name: 'Málaga Hoy', url: 'https://www.malagahoy.es/rss/', scope: 'local', region: 'Andalucía' },
  { name: 'Granada Hoy', url: 'https://www.granadahoy.com/rss/', scope: 'local', region: 'Andalucía' },
  { name: 'Diario Sur', url: 'https://www.diariosur.es/rss/2.0/', scope: 'local', region: 'Andalucía' },
  { name: 'Levante-EMV', url: 'https://www.levante-emv.com/rss/', scope: 'local', region: 'Comunitat Valenciana' },
  { name: 'Valencia Plaza', url: 'https://valenciaplaza.com/rss', scope: 'local', region: 'Comunitat Valenciana' },
  { name: 'Faro de Vigo', url: 'https://www.farodevigo.es/rss/', scope: 'local', region: 'Galicia' },
  { name: 'Noticias de Navarra', url: 'https://www.noticiasdenavarra.com/rss/', scope: 'local', region: 'Navarra' },
  { name: 'El Norte de Castilla', url: 'https://www.elnortedecastilla.es/rss/2.0/', scope: 'local', region: 'Castilla y León' },
  { name: 'Heraldo de Aragón', url: 'https://www.heraldo.es/rss/', scope: 'local', region: 'Aragón' },
  { name: 'La Nueva España', url: 'https://www.lne.es/rss/', scope: 'local', region: 'Asturias' },
  { name: 'Canarias7', url: 'https://www.canarias7.es/rss/2.0/portada', scope: 'local', region: 'Canarias' },
  { name: 'Diario de Mallorca', url: 'https://www.diariodemallorca.es/rss/', scope: 'local', region: 'Illes Balears' },
  { name: 'La Verdad', url: 'https://www.laverdad.es/rss/2.0/', scope: 'local', region: 'Región de Murcia' },
  { name: 'La Rioja', url: 'https://www.larioja.com/rss/2.0/', scope: 'local', region: 'La Rioja' }
];
