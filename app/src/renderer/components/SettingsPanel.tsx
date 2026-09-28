export function SettingsPanel({ refreshMinutes, onChange }: { refreshMinutes: number; onChange: (value: number) => void }) {
  return <label>Refresh every <input type="number" min="1" value={refreshMinutes} onChange={event => onChange(Number(event.target.value))} /> minutes</label>;
}
