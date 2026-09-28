export type NotificationRule = { id: string; sourceId: string | null; keyword: string | null; category: string | null; enabled: boolean };

export function matchesNotificationRule(rule: NotificationRule, article: { sourceId: string; title: string; summary: string; category: string | null }): boolean {
  if (!rule.enabled) return false;
  if (rule.sourceId && rule.sourceId !== article.sourceId) return false;
  const text = `${article.title} ${article.summary}`.toLowerCase();
  if (rule.keyword && !text.includes(rule.keyword.toLowerCase())) return false;
  if (rule.category && rule.category !== article.category) return false;
  return Boolean(rule.sourceId || rule.keyword || rule.category);
}
