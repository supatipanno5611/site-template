export const siteConfig = {
  title: 'sakko',
  description: '',
  lang: 'en' as 'en' | 'ko' | 'si',
  VAULT_PUBLISH: 'C:\\Markdown\\medicine\\sakko',
  homeSlug: 'home',
  curatedTopicSourceTitles: [] as string[],
  contentDoctor: {
    ignoreFiles: [] as string[],
    ignoreRulesBySlug: {} as Record<string, string[]>,
    ignoreRulesByFile: {} as Record<string, string[]>,
  },
}
