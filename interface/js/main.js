async function onSubmit(event) {
  event.preventDefault();

  if (!isValid()) {
    return;
  }

  showLoading(event.target);

  try {
    const results = await fetch(
      'https://rwtu65e2x3nebiq7ds5gdduyda0phcxa.lambda-url.us-east-1.on.aws/',
      {
        method: "POST",
        body: JSON.stringify({
          show: document.getElementById('show').value,
          query: document.getElementById('query').value,
        }),
      },
    ).then((r) => r.json());

    if (results.length > 0) {
      document.getElementById('results-table').classList.remove('no-results');
      document.getElementById('results-container').innerHTML = results
        .map((result) => `<tr><td>S00E00</td><td>${result.title}</td><td><a href="" target="_blank">Script</a></td><td><a href="" target="_blank">IMDb</a></td></tr>`)
        .join('\n');
    } else {
      document.getElementById('results-table').classList.add('no-results');
    }
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 750));
    hideLoading(event.target);
  }
}

function showLoading(element) {
  element.setAttribute('disabled', '');
  document.getElementById('spinner').classList.remove('hidden');
  document.getElementById('spinner').style.display = '';
}

function hideLoading(element) {
  element.removeAttribute('disabled');
  document.getElementById('spinner').classList.add('hidden');
}

function isValid() {
  if (!document.getElementById('show').value) {
    document.getElementById('show').focus();
    return false;
  }

  if (!document.getElementById('query').value) {
    document.getElementById('query').focus();
    return false;
  }

  return true;
}
