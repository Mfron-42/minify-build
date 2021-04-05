const minify = require('minify');
const fs = require('fs');
const path = require('path');
const { resolve } = require('path');


let [src, dest] = process.argv.slice(2, 4);
dest = resolve(dest, "");
src = resolve(src, "");
const  minifiedFiles = ['.js', '.html', '.css'];

if (!src || !dest) {
    throw Error("Please specify src and dest : minify-build src/folder dist/folder");
}


minifyDir(src);

function minifyDir(directory) {
    const destDirectory = directory.replace(src, dest);
    if (!fs.existsSync(destDirectory))
        fs.mkdirSync(destDirectory);
    const contents = fs.readdirSync(directory);
    return contents.map(async content => {
        const srcFullPath = path.resolve(directory, content);
        if (fs.lstatSync(srcFullPath).isDirectory()){
            return minifyDir(srcFullPath);
        }
        const destFullPath = path.resolve(destDirectory, content);
        const ext = path.extname(content);
        if (!minifiedFiles.includes(ext)) {
            fs.copyFileSync(srcFullPath, destFullPath);
            return;
        }
        const minifiedContent = await minify(srcFullPath);
        fs.writeFileSync(destFullPath, minifiedContent);
    });
}
