function createPage(bpm, message) {
  const state = message ?
    `<h3>Virhe: ${message} !!! :(</h3>` :
    `<h3>Kaikki ok :)</h3>`;
  return `
    <html>
      <head>
        <title>Gyldenintien VALOSHOW!</title>
      </head>
      <body>
        <h1>Gyldenintien VALOSHOW!</h1>
        <form method="POST">
          <label>BPM:</label>
          <input type="number" step="1" name="bpm" value="${bpm}"/>
          <button type="submit">SET!</button>
        </form>
        ${state}
      </body>
    </html>
  `;
}

module.exports = createPage;
