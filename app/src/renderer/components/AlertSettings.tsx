import { useState } from 'react';
import type { NotificationRule } from '../../../shared/models/notification-rule';

export function AlertSettings({ rules, onSave, onDelete, labels }: { rules: NotificationRule[]; onSave: (keyword: string) => void; onDelete: (id: string) => void; labels: { keyword: string; placeholder: string; create: string; list: string; empty: string; remove: (label: string) => string } }) {
  const [keyword, setKeyword] = useState('');
  return <>
    <form onSubmit={event => { event.preventDefault(); if (keyword.trim()) onSave(keyword.trim()); }}>
      <input aria-label={labels.keyword} placeholder={labels.placeholder} value={keyword} onChange={event => setKeyword(event.target.value)} />
      <button type="submit">{labels.create}</button>
    </form>
    <ul className="alert-list" aria-label={labels.list}>
      {rules.length === 0 ? <li className="alert-empty">{labels.empty}</li> : rules.map(rule => <li key={rule.id}>
        <span className="alert-label">{rule.keyword || rule.category || 'All stories'}</span>
        <button className="remove alert-remove" type="button" title={labels.remove(rule.keyword || rule.category || 'all stories')} aria-label={labels.remove(rule.keyword || rule.category || 'all stories')} onClick={() => onDelete(rule.id)}>×</button>
      </li>)}
    </ul>
  </>;
}
