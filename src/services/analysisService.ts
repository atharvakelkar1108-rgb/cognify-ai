export async function analyzeText(text: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Failed to analyze text');
  return response.json();
}

export async function startSession(userId: string, text: string) {
  const response = await fetch('/api/session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, text }),
  });
  if (!response.ok) throw new Error('Failed to start session');
  return response.json();
}

export async function getCognitiveProfile(userId: string) {
  const response = await fetch(`/api/session/profile/${userId}`);
  if (!response.ok) throw new Error('Failed to get profile');
  return response.json();
}

export async function predictDifficulty(sentenceData: object) {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence_data: sentenceData }),
  });
  if (!response.ok) throw new Error('Failed to predict difficulty');
  return response.json();
}