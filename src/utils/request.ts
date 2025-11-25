const request = async (url: string, method = "GET", body: any = null, headers = {}) => {
  const options: RequestInit = {
    method,
    headers: {
      // "Content-Type": "application/json",
      // "api-key": "9513cb72-2eec-415a-b71f-73f3d512251b",
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // https://corsproxy.io/?


  // const url = `https://corsproxy.io/?https://api.tusky.io${encodeURIComponent(url)}`
  console.log('request url: ', url)
  return fetch(url, options).then(async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText}\n${errorText}`.trim());
  }

  const text = await response.text(); // Read body once, safely

  try {
    return JSON.parse(text); // Try to parse as JSON
  } catch (err) {
    // If parsing fails, return the raw text (useful for HTML error pages, plain text APIs, etc.)
    return text || ''; // return empty string if somehow text is falsy
  }
});
}

window.request = request

export default request