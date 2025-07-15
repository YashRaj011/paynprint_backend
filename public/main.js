document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const responseDiv = document.getElementById('response');
  const iframe = document.getElementById('preview');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    responseDiv.textContent = 'Processing...';
    iframe.src = '';

   try {
  const res = await fetch('http://localhost:8000/upload-process', {
    method: 'POST',
    body: formData
  });
    console.log(res);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server responded with ${res.status}: ${text}`);
  }

  const data = await res.json();
  console.log('✅ Success:', data);
  // update DOM...
  responseDiv.textContent = `fileID : ${data.fileId} price : ${data.price}`;
    iframe.src = `${data.previewUrl}`;

} catch (err) {
  console.error('❌ Fetch Error:', err.message || err);
}

  });
});
