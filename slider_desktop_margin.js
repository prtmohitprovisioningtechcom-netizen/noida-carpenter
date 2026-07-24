const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'noida_carpenter');
if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html'));

    const slider_margin_css = `
<style id="slider-desktop-margin">
/* --- PULL SLIDER UP ON ALL DEVICES --- */
#homeCarousel, .carousel, .ttm-slider {
    margin-top: 0 !important;
    padding-top: 0 !important;
}
/* Ensure header doesn't push it down */
header#masthead, .site-header-menu, .site-header-menu-inner {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}
</style>
`;

    let count = 0;
    for (const file of files) {
        const filePath = path.join(targetDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Scrub any old margin-top rules that were pushing it down on desktop
        content = content.replace(/margin-top:\s*130px\s*!important;/gi, '');
        content = content.replace(/margin-top:\s*100px\s*!important;/gi, '');
        content = content.replace(/margin-top:\s*90px\s*!important;/gi, '');
        
        // Remove previous instance if it exists
        content = content.replace(/<style id="slider-desktop-margin">(.|\n)*?<\/style>/gi, '');
        
        // Inject new CSS right before </head>
        content = content.replace('</head>', slider_margin_css + '\n</head>');
        
        fs.writeFileSync(filePath, content, 'utf-8');
        count++;
    }
    console.log(`Pulled slider up on desktop across ${count} files.`);
}
