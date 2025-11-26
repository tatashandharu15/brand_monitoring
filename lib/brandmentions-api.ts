// BrandMentions API client
const BASE_URL = "https://api.brandmentions.com"

interface BrandMentionsConfig {
  apiKey: string
}

export class BrandMentionsAPI {
  private apiKey: string

  constructor(config: BrandMentionsConfig) {
    this.apiKey = config.apiKey
  }

  private async request(command: string, params: Record<string, any> = {}) {
    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      command,
      ...params,
    })

    const response = await fetch(`${BASE_URL}/command.php?${queryParams}`)
    if (!response.ok) {
      throw new Error(`BrandMentions API error: ${response.statusText}`)
    }
    return response.json()
  }

  // Get remaining API credits
  async getRemainingCredits() {
    return this.request("GetRemainingCredits")
  }

  // List all projects
  async listProjects() {
    return this.request("ListProjects")
  }

  // Get project mentions with pagination and filters
  async getProjectMentions(
    projectId: string,
    options: {
      page?: number
      perPage?: number
      startPeriod?: string
      endPeriod?: string
      sources?: string[]
      countries?: string[]
    } = {},
  ) {
    const params: Record<string, any> = {
      project_id: projectId,
      page: options.page || 1,
      per_page: options.perPage || 250,
    }

    if (options.startPeriod) params.start_period = options.startPeriod
    if (options.endPeriod) params.end_period = options.endPeriod
    if (options.sources) {
      options.sources.forEach((source) => {
        params[`sources[]`] = source
      })
    }
    if (options.countries) {
      options.countries.forEach((country) => {
        params[`countries[]`] = country
      })
    }

    return this.request("GetProjectMentions", params)
  }

  // Get project influencers
  async getProjectInfluencers(
    projectId: string,
    options: {
      page?: number
      perPage?: number
      startPeriod?: string
      endPeriod?: string
      sources?: string[]
    } = {},
  ) {
    const params: Record<string, any> = {
      project_id: projectId,
      page: options.page || 1,
      per_page: options.perPage || 100,
    }

    if (options.startPeriod) params.start_period = options.startPeriod
    if (options.endPeriod) params.end_period = options.endPeriod
    if (options.sources) {
      options.sources.forEach((source) => {
        params[`sources[]`] = source
      })
    }

    return this.request("GetProjectInfluencers", params)
  }

  // Get mention count for a project
  async getMentionCount(projectId: string) {
    return this.request("GetMentionsCount", { project_id: projectId })
  }

  // Create a new project
  async addProject(config: {
    name: string
    keyword1: string
    keyword2?: string
    matchType1?: string
    languages?: string[]
    countries?: string[]
    activeSources?: string[]
    requiredKeywords1?: string[]
    excludedKeywords2?: string[]
  }) {
    const params: Record<string, any> = {
      name: config.name,
      keyword1: config.keyword1,
    }

    if (config.keyword2) params.keyword2 = config.keyword2
    if (config.matchType1) params.match_type1 = config.matchType1
    if (config.languages) {
      config.languages.forEach((lang) => {
        params[`languages[]`] = lang
      })
    }
    if (config.countries) {
      config.countries.forEach((country) => {
        params[`countries[]`] = country
      })
    }
    if (config.activeSources) {
      config.activeSources.forEach((source) => {
        params[`active_sources[]`] = source
      })
    }

    return this.request("AddProject", params)
  }

  // Delete a project
  async deleteProject(projectId: string) {
    return this.request("DeleteProject", { project_id: projectId })
  }
}

// API instances should be created in server-side code only
