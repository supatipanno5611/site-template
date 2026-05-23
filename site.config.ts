export const siteConfig = {
  title: 'template',
  description: '',
  lang: 'en' as 'en' | 'ko' | 'si',
  VAULT_PUBLISH: '',
  homeSlug: 'home',
  curatedTopicSourceTitles: [] as string[],
  contentDoctor: {
    ignoreFiles: [] as string[],
    ignoreRulesBySlug: {} as Record<string, string[]>,
    ignoreRulesByFile: {} as Record<string, string[]>,
  },
}
