export default async function handler() {
  const username = process.env.GITHUB_USERNAME || process.env.VITE_GITHUB_USERNAME || 'DylanMH'
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing GITHUB_PERSONAL_ACCESS_TOKEN' }),
    }
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `GitHub API error: ${response.status}` }),
      }
    }

    const data = await response.json()

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
    }
  }
}
