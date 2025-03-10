const fs = require('fs');

// 解析词根行的函数
function parseRootLine(line) {
    const regex = /^(\d+)\.-([\w()-]+(?:=-[\w()-]+)*)-(.+)$/;
    const match = line.match(regex);
    if (!match) {
        console.error(`无法解析词根行: ${line}`);
        return null;
    }

    const [_, index, variantsStr, meaning] = match;
    const variantsArray = variantsStr.split('=-').map(variant => variant.replace(/\([^)]*\)/g, '').replace(/-$/, ''));
    const variantsObj = {};
    variantsArray.forEach(variant => {
        variantsObj[variant] = []; // 初始化为空数组，存储匹配的单词
    });

    return {
        '序号': parseInt(index, 10),
        '词根变体': variantsObj,
        '含义': meaning.trim(),
        '历史': []
    };
}

// 解析单词行的函数
function parseWordLine(wordLine) {
    const regex = /^([a-zA-Z-]+(?:-[a-zA-Z-]+)*)\[(.*?)\](.*?)(?:【.*?\])*$/;
    const match = wordLine.match(regex);
    if (!match) {
        console.error(`无法解析单词行: ${wordLine}`);
        return null;
    }

    const [_, word, phonetic, meaning] = match;
    return {
        '单词': word.trim(),
        '读音': phonetic.trim(),
        '含义': meaning.trim()
    };
}

// 处理单行内容的函数
function processLine(line, currentRoot = null) {
    line = line.trim();
    if (!line) return currentRoot;

    if (/^\d+\./.test(line)) {
        return parseRootLine(line);
    }

    if (line.startsWith('【')) {
        if (!currentRoot) {
            console.error('未找到词根对象，无法添加历史字段');
            return null;
        }
        currentRoot['历史'].push(line);
        return currentRoot;
    }

    if (/^[a-zA-Z].*\[.*?\]/.test(line)) {
        if (!currentRoot) {
            console.error('未找到词根对象，无法处理单词行');
            return null;
        }
        const wordObj = parseWordLine(line);
        if (wordObj) {
            // 直接匹配并添加到词根变体中
            const word = wordObj['单词'];
            for (const variant in currentRoot['词根变体']) {
                if (word.includes(variant)) {
                    currentRoot['词根变体'][variant].push(wordObj);
                }
            }
        }
        return currentRoot;
    }

    if (currentRoot && currentRoot['历史'].length > 0) {
        const lastHistoryIndex = currentRoot['历史'].length - 1;
        currentRoot['历史'][lastHistoryIndex] += `\n${line}`;
    }

    return currentRoot;
}

// 处理多行内容的函数
function processLines(lines) {
    let currentRoot = null;
    const results = [];

    for (const line of lines) {
        const updatedRoot = processLine(line, currentRoot);
        if (updatedRoot && updatedRoot !== currentRoot) {
            if (currentRoot) results.push(currentRoot);
            currentRoot = updatedRoot;
        }
    }

    if (currentRoot) results.push(currentRoot);
    return results;
}

// 读取文件并处理
function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`读取文件失败: ${err}`);
            return;
        }

        const lines = data.split('\n');
        const results = processLines(lines);

        console.log(JSON.stringify(results, null, 2));

        fs.writeFile('output.json', JSON.stringify(results, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(`保存结果失败: ${err}`);
            } else {
                console.log('结果已保存至 output.json');
            }
        });
    });
}

// 执行文件处理
const filePath = './word_roots.txt';
processFile(filePath);