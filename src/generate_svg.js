const fs = require('fs');

async function generateSVG() {
  const currentTime = new Date().toISOString();
  const svgContent = `
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="50" font-family="Arial" font-size="20" fill="blue">
        Time: ${currentTime}
      </text>
    </svg>
  `;
  await fs.writeFileSync('output.svg', svgContent);
  console.log('SVG has been generated.');
}

module.exports = generateSVG;
