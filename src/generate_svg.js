const fs = require('fs');

function generateSVG(filePath)
{
	const currentTime = new Date().toISOString();
	const svgContent = `
		<svg width="500" height="100" xmlns="http://www.w3.org/2000/svg">
			<text x="10" y="50" font-family="Arial" font-size="20" fill="blue">
				Time: ${currentTime}
			</text>
		</svg>
	`;
	console.log('Attempting to generate SVG at:', filePath);
	fs.writeFileSync(filePath, svgContent);
	console.log('SVG has been generated.');
}

module.exports = generateSVG;
