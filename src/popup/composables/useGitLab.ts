import type { GitLabConfig, EncodedFile } from '../types'

export function useGitLab() {
  async function uploadFiles(
    config: GitLabConfig,
    files: EncodedFile[],
    branch: string,
    commitMessage: string,
    overwrite: boolean,
  ): Promise<void> {
    const { host, token, owner, repo } = config
    const namespace = owner ? `${owner}/${repo}` : repo
    const projectId = encodeURIComponent(namespace)
    const url = `${host.replace(/\/$/, '')}/api/v4/projects/${projectId}/repository/commits`

    const actions = files.map((file) => ({
      action: overwrite ? 'update' : 'create',
      file_path: file.path,
      content: file.base64,
      encoding: 'base64',
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': token,
      },
      body: JSON.stringify({
        branch,
        commit_message: commitMessage,
        actions,
      }),
    })

    if (!response.ok) {
      let message = `GitLab API error: ${response.status}`
      try {
        const json = await response.json()
        if (json.message) message = json.message
      } catch {
        // ignore parse errors
      }
      throw new Error(message)
    }
  }

  return { uploadFiles }
}
