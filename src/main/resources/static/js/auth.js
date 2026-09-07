function renderResult(target, status, body) {
  document.getElementById(target).textContent = 'HTTP ' + status + '\n' + JSON.stringify(body, null, 2);
}

async function submitJson(event, url, target) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  if (body.token) {
    localStorage.setItem('scholarsync.token', body.token);
  }
  renderResult(target, response.status, body);
}
