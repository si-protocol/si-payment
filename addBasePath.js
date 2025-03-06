const fs = require('fs');
const path = require('path');

const fixDirs = fs.readdirSync(__dirname).filter((dir) => {
    console.log('dir', dir);
    return fs.statSync(path.join(__dirname, dir)).isDirectory() && !['node_modules'].includes(dir) && !dir.startsWith('.');
});

function updatePathsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(/(href|src)="(\/[^"]+\.(png|ico|svg|jpg|jpeg|gif|webp))"/g, '$1={`${process.env.NEXT_PUBLIC_BASE_PATH}$2`}');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated paths in: ${filePath}`);
}

function processFilesInDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const fullPath = path.join(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
            processFilesInDirectory(fullPath);
        } else if (/\.(html|css|tsx)$/.test(fullPath)) {
            updatePathsInFile(fullPath);
        }
    });
}

fixDirs.forEach((path) => {
    processFilesInDirectory(path);
});
