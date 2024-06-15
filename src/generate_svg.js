const { writeFile } = require('fs').promises;

async function generateSVG(filePath) {
  const currentTime = new Date().toISOString();
  const svgContent = `
    <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="50" font-family="Arial" font-size="20" fill="blue">
        Time: ${currentTime}
      </text>
    </svg>
  `;
  console.log('Attempting to generate SVG at:', filePath);
  await FileSystem.promises.writeFile(filePath, svgContent);
  console.log('SVG has been generated.');
}

module.exports = generateSVG;
