import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { NewsItem, NewsSource } from '../../shared/models/types';
import type { NotificationRule } from '../../shared/models/notification-rule';
import { filterArticles } from '../../shared/models/article-filter';
import { AlertSettings } from './components/AlertSettings';
import { popularSources, type PopularSource } from './data/popular-sources';

type Language = 'en' | 'es';

const translations = {
  en: {
    desk: 'PERSONAL NEWS DESK', sources: 'YOUR SOURCES', sourceCount: (count: number) => count === 0 ? 'No sources connected' : `${count} connected`, allCoverage: 'All coverage', popularFeeds: 'POPULAR RSS SOURCES', chooseFeed: 'Choose a popular source', addPopular: 'Add selected source', alreadyAdded: 'This source is already connected.', national: 'National · Spain', international: 'International', local: 'Local · Spain', connectFeed: 'ADD ANY FEED URL', sourceName: 'Source name', feedUrl: 'https://.../feed.xml', categoryOptional: 'Category (optional)', addSource: 'Add source', alerts: 'ALERTS',
    eyebrowDate: 'Live coverage', refresh: 'Refresh signal', refreshFromLogo: 'Refresh news', refreshing: 'Refreshing your sources...', ready: 'Ready to scan the signal.', cannotLoad: 'Could not load saved coverage.', adding: 'Adding source...', connectedMessage: 'Source connected.', cannotAdd: 'Could not add source.', refreshFailed: 'Refresh failed. Check your feed URLs.', failedFeeds: (count: number) => `${count} source(s) failed to refresh.`, updated: (count: number) => `Updated ${count} stories.`, alertCreated: (keyword: string) => `Alert created for "${keyword}".`, cannotCreateAlert: 'Could not create alert.', alertDeleted: 'Alert deleted.', cannotDeleteAlert: 'Could not delete alert.',
    search: 'Search headlines', unread: 'unread', saved: 'favorites', sourcesStat: 'sources', tabAll: 'All', tabSaved: 'Favorites', tabRead: 'Read', emptyTitle: 'No stories in this view', emptySaved: 'No favorites yet', emptyRead: 'No read stories yet', emptyText: 'Add a feed or change your filters to tune the signal.', openStory: 'Open story', markUnread: 'Mark unread', markRead: 'Mark read', favorite: 'Add to favorites', unfavorite: 'Remove from favorites',
    english: 'English', spanish: 'Spanish', alertsInput: 'Alert keyword', alertPlaceholder: 'Alert keyword', createAlert: 'Create alert', alertList: 'Created alerts', noAlerts: 'No alerts created', removeAlert: (label: string) => `Remove alert for ${label}`
  },
  es: {
    desk: 'TU ESCRITORIO DE NOTICIAS', sources: 'TUS FUENTES', sourceCount: (count: number) => count === 0 ? 'Ninguna fuente conectada' : `${count} fuente(s) conectada(s)`, allCoverage: 'Todas las noticias', popularFeeds: 'FUENTES RSS POPULARES', chooseFeed: 'Elige un medio popular', addPopular: 'Añadir medio seleccionado', alreadyAdded: 'Esta fuente ya está añadida.', national: 'Nacionales · España', international: 'Internacionales', local: 'Locales · España', connectFeed: 'AÑADIR CUALQUIER URL RSS', sourceName: 'Nombre de la fuente', feedUrl: 'https://.../feed.xml', categoryOptional: 'Categoría (opcional)', addSource: 'Añadir fuente', alerts: 'ALERTAS',
    eyebrowDate: 'Cobertura en directo', refresh: 'Actualizar noticias', refreshFromLogo: 'Actualizar noticias', refreshing: 'Actualizando tus fuentes...', ready: 'Listo para revisar las noticias.', cannotLoad: 'No se pudieron cargar las noticias guardadas.', adding: 'Añadiendo fuente...', connectedMessage: 'Fuente conectada.', cannotAdd: 'No se pudo añadir la fuente.', refreshFailed: 'Error al actualizar. Revisa las direcciones de las fuentes.', failedFeeds: (count: number) => `No se pudieron actualizar ${count} fuente(s).`, updated: (count: number) => `Se actualizaron ${count} noticias.`, alertCreated: (keyword: string) => `Alerta creada para «${keyword}».`, cannotCreateAlert: 'No se pudo crear la alerta.', alertDeleted: 'Alerta eliminada.', cannotDeleteAlert: 'No se pudo eliminar la alerta.',
    search: 'Buscar noticias', unread: 'sin leer', saved: 'favoritas', sourcesStat: 'fuentes', tabAll: 'Todas', tabSaved: 'Favoritas', tabRead: 'Leídas', emptyTitle: 'No hay noticias en esta vista', emptySaved: 'Aún no hay favoritas', emptyRead: 'Aún no hay noticias leídas', emptyText: 'Añade una fuente o cambia los filtros.', openStory: 'Abrir noticia', markUnread: 'Marcar como no leída', markRead: 'Marcar como leída', favorite: 'Añadir a favoritas', unfavorite: 'Quitar de favoritas',
    english: 'Inglés', spanish: 'Castellano', alertsInput: 'Palabra clave de alerta', alertPlaceholder: 'Palabra clave', createAlert: 'Crear alerta', alertList: 'Alertas creadas', noAlerts: 'No hay alertas creadas', removeAlert: (label: string) => `Eliminar alerta para ${label}`
  }
} as const;

function App() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('signal-desk-language') === 'es' ? 'es' : 'en');
  const t = translations[language];
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);
  const [query, setQuery] = useState('');
  const [activeSource, setActiveSource] = useState('all');
  const [activeView, setActiveView] = useState<'all' | 'saved' | 'read'>('all');
  const [selectedPopularUrl, setSelectedPopularUrl] = useState('');
  const emptyStateText = activeView === 'saved'
    ? (language === 'es' ? 'Marca una noticia con la estrella para dejarla aquí.' : 'Star a story to keep it here.')
    : activeView === 'read'
      ? t.emptyText
      : t.emptyText;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>(t.ready);
  const [newSource, setNewSource] = useState({ name: '', url: '', category: '' });

  useEffect(() => {
    localStorage.setItem('signal-desk-language', language);
    document.documentElement.lang = language === 'es' ? 'es' : 'en';
    setMessage(translations[language].ready);
  }, [language]);

  async function load() {
    try {
      const [loadedSources, loadedArticles, loadedRules] = await Promise.all([window.newsApi.listSources(), window.newsApi.listArticles(), window.newsApi.listNotificationRules()]);
      setSources(loadedSources);
      setArticles(loadedArticles);
      setNotificationRules(loadedRules);
    } catch {
      setMessage(t.cannotLoad);
    }
  }
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => filterArticles(articles, {
    activeView,
    activeSource,
    query
  }), [articles, activeView, activeSource, query]);

  async function addSource(event: React.FormEvent) {
    event.preventDefault(); setMessage(t.adding);
    try { await window.newsApi.addSource({ ...newSource, category: newSource.category || null }); setNewSource({ name: '', url: '', category: '' }); await load(); setMessage(t.connectedMessage); }
    catch (error) { setMessage(error instanceof Error ? error.message : t.cannotAdd); }
  }
  async function addPopularSource() {
    const selected = popularSources.find(source => source.url === selectedPopularUrl);
    if (!selected) return;
    if (sources.some(source => source.url === selected.url)) {
      setMessage(t.alreadyAdded);
      return;
    }
    setMessage(t.adding);
    try {
      await window.newsApi.addSource({ name: selected.name, url: selected.url, category: selected.region });
      await load();
      setMessage(t.connectedMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.cannotAdd);
    }
  }
  async function refresh() {
    setLoading(true);
    setMessage(t.refreshing);
    try {
      const result = await window.newsApi.refresh();
      setArticles(result.articles);
      setSources(result.sources);
      const errors = result.results.filter(item => item.error);
      setMessage(errors.length > 0 ? t.failedFeeds(errors.length) : t.updated(result.articles.length));
    } catch {
      setMessage(t.refreshFailed);
    } finally {
      setLoading(false);
    }
  }
  async function setState(id: string, state: { isRead?: boolean; isSaved?: boolean }) { await window.newsApi.setArticleState(id, state); setArticles(current => current.map(item => item.id === id ? { ...item, ...state } : item)); }

  async function saveAlert(keyword: string) {
    try {
        await window.newsApi.addNotificationRule({
        sourceId: null,
        keyword,
        category: null
        });
        setNotificationRules(await window.newsApi.listNotificationRules());
        setMessage(t.alertCreated(keyword));
    } catch {
        setMessage(t.cannotCreateAlert);
    }
    }
  async function deleteAlert(id: string) {
    try {
      await window.newsApi.removeNotificationRule(id);
      setNotificationRules(current => current.filter(rule => rule.id !== id));
      setMessage(t.alertDeleted);
    } catch {
      setMessage(t.cannotDeleteAlert);
    }
  }
  return <div className="shell">
    <header className="topbar">
      <button className="brand brand-trigger" type="button" onClick={() => void refresh()} disabled={loading} aria-label={t.refreshFromLogo} title={t.refreshFromLogo}>
        <span className="brand-mark">NP</span><span className="brand-copy"><p className="eyebrow">{t.desk}</p><span className="brand-name">NewsPop</span></span>
      </button>
      <div className="topbar-actions">
        <div className="language-switcher" role="group" aria-label={language === 'es' ? 'Idioma' : 'Language'}>
          <button className="language-button" type="button" aria-label={t.english} aria-pressed={language === 'en'} title={t.english} onClick={() => setLanguage('en')}><span aria-hidden="true">🇬🇧</span></button>
          <button className="language-button" type="button" aria-label={t.spanish} aria-pressed={language === 'es'} title={t.spanish} onClick={() => setLanguage('es')}><span aria-hidden="true">🇪🇸</span></button>
        </div>
        <button className="refresh" onClick={() => void refresh()} disabled={loading}><span>{loading ? '...' : '↻'}</span> {t.refresh}</button>
      </div>
    </header>
    <main className="layout">
      <aside className="sidebar">
        <div className="side-heading"><div><p className="eyebrow">{t.sources}</p><strong>{t.sourceCount(sources.length)}</strong></div><span className="live-dot" /></div>
        <button className={`source-filter ${activeSource === 'all' ? 'active' : ''}`} onClick={() => setActiveSource('all')}><span>◈</span> {t.allCoverage} <b>{articles.length}</b></button>
        {sources.map(source => <div className="source-row" key={source.id}>
          <button className={`source-filter ${activeSource === source.id ? 'active' : ''}`} onClick={() => setActiveSource(source.id)}><span>●</span> {source.name} <b>{articles.filter(item => item.sourceId === source.id && !item.isRead).length || ''}</b></button>
          <button className="remove" title={language === 'es' ? 'Eliminar fuente' : 'Remove source'} aria-label={language === 'es' ? `Eliminar fuente ${source.name}` : `Remove source ${source.name}`} onClick={async () => { await window.newsApi.removeSource(source.id); await load(); }}>×</button>
        </div>)}
        <div className="add-source popular-source-picker">
          <p className="eyebrow">{t.popularFeeds}</p>
          <select aria-label={t.chooseFeed} value={selectedPopularUrl} onChange={event => setSelectedPopularUrl(event.target.value)}>
            <option value="">{t.chooseFeed}</option>
            {(['national', 'international', 'local'] as const).map(scope => <optgroup key={scope} label={t[scope]}>
              {popularSources.filter(source => source.scope === scope).map((source: PopularSource) => <option key={source.url} value={source.url}>{source.name} · {source.region}</option>)}
            </optgroup>)}
          </select>
          <button type="button" onClick={() => void addPopularSource()} disabled={!selectedPopularUrl}>+ {t.addPopular}</button>
        </div>
        <form className="add-source" onSubmit={addSource}>
          <p className="eyebrow">{t.connectFeed}</p>
          <input aria-label={t.sourceName} placeholder={t.sourceName} value={newSource.name} onChange={event => setNewSource({ ...newSource, name: event.target.value })} />
          <input aria-label={language === 'es' ? 'Dirección del canal' : 'Feed URL'} placeholder={t.feedUrl} value={newSource.url} onChange={event => setNewSource({ ...newSource, url: event.target.value })} />
          <input aria-label={t.categoryOptional} placeholder={t.categoryOptional} value={newSource.category} onChange={event => setNewSource({ ...newSource, category: event.target.value })} />
          <button type="submit">+ {t.addSource}</button>
        </form>
        <div className="add-source">
          <p className="eyebrow">{t.alerts}</p>
          <AlertSettings rules={notificationRules} onSave={saveAlert} onDelete={deleteAlert} labels={{ keyword: t.alertsInput, placeholder: t.alertPlaceholder, create: t.createAlert, list: t.alertList, empty: t.noAlerts, remove: t.removeAlert }} />
        </div>
      </aside>
      <section className="content">
        <div className="content-head">
          <div>
            <p className="eyebrow">{new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase()}</p>
            <h2>{t.eyebrowDate}</h2>
            <p className="status">{message}</p>
          </div>
          <div className="search"><span>⌕</span><input aria-label={t.search} placeholder={t.search} value={query} onChange={event => setQuery(event.target.value)} /></div>
        </div>
        <div className="stats">
          <div><span className="stat-value">{articles.filter(item => !item.isRead).length}</span><span>{t.unread}</span></div>
          <div><span className="stat-value">{articles.filter(item => item.isSaved).length}</span><span>{t.saved}</span></div>
          <div><span className="stat-value">{sources.length}</span><span>{t.sourcesStat}</span></div>
        </div>
        <div className="view-tabs" role="tablist" aria-label={language === 'es' ? 'Listas de noticias' : 'News lists'}>
          <button className={activeView === 'all' ? 'view-tab active' : 'view-tab'} role="tab" aria-selected={activeView === 'all'} onClick={() => setActiveView('all')}>{t.tabAll}<span>{articles.length}</span></button>
          <button className={activeView === 'saved' ? 'view-tab active' : 'view-tab'} role="tab" aria-selected={activeView === 'saved'} onClick={() => setActiveView('saved')}>{t.tabSaved}<span>{articles.filter(item => item.isSaved).length}</span></button>
          <button className={activeView === 'read' ? 'view-tab active' : 'view-tab'} role="tab" aria-selected={activeView === 'read'} onClick={() => setActiveView('read')}>{t.tabRead}<span>{articles.filter(item => item.isRead).length}</span></button>
        </div>
        <div className="feed">
          {filtered.length === 0 ? <div className="empty"><span>◎</span><h3>{activeView === 'saved' ? t.emptySaved : activeView === 'read' ? t.emptyRead : t.emptyTitle}</h3><p>{emptyStateText}</p></div> : filtered.map(article => <article className={`article ${article.isRead ? 'read' : ''}`} key={article.id}>
            <div className="article-meta"><span className="source-tag">{article.sourceName}</span><time>{new Date(article.publishedAt).toLocaleString(language === 'es' ? 'es-ES' : 'en-US', { hour: 'numeric', minute: '2-digit' })}</time></div>
            <h3>{article.title}</h3>{article.summary && <p>{article.summary}</p>}
            <div className="article-actions">
              <a href={article.link} target="_blank" rel="noreferrer">{t.openStory} ↗</a>
              <button type="button" onClick={() => void setState(article.id, { isRead: !article.isRead })}>{article.isRead ? t.markUnread : t.markRead}</button>
              <button
                type="button"
                className={`favorite-toggle ${article.isSaved ? 'active' : ''}`}
                aria-label={article.isSaved ? t.unfavorite : t.favorite}
                aria-pressed={article.isSaved}
                title={article.isSaved ? t.unfavorite : t.favorite}
                onClick={() => void setState(article.id, { isSaved: !article.isSaved })}
              >
                <span aria-hidden="true">{article.isSaved ? '★' : '☆'}</span>
              </button>
            </div>
          </article>)}
        </div>
      </section>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
