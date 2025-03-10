const fs = require('fs');
const path = require('path');

/**
 * 读取文件内容
 * @param {string} filePath - 文件路径
 * @returns {string} 文件内容
 */
function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`读取文件失败: ${error.message}`);
        return null;
    }
}

/**
 * 处理词根变体
 * @param {string} rootText - 词根文本
 * @returns {object} 处理后的词根信息
 */
function processRootVariants(rootText) {
    const variants = [];
    let currentVariant = '';
    let meaning = '';
    
    // 检查是否包含括号"()"，如果有，则表示有多个变体
    const hasParentheses = rootText.includes('(');
    
    if (hasParentheses) {
        // 处理带括号的变体,,则将括号前的部分作为变体，去掉括号"("和")"后的部分作为另一个变体例如bol(o),则bol和bolo都是词根变体,将两个变体都加入到variants数组中


    } else {
        // 处理不带括号的变体,直接将这个变体键入到variants数组中
    }
    
    // 查找中文含义（在 = 号之后）
    const meaningIndex = rootText.indexOf('=');
    if (meaningIndex !== -1) {
        meaning = rootText.substring(meaningIndex + 1).trim();
    }
    
    return {
        variants,
        meaning
    };
}

/**
 * 处理词根条目
 * @param {string} line - 词根行文本
 * @returns {object} 处理后的词根对象
 */
function processRootEntry(line) {
    // 当改行内容是以数字开头的时候,将数字保存在对象中,并将数字和紧跟数字的"."去掉,将剩下的内容保存在变量cleanLine中,例如1.-vinc-=-vict-胜，征服,则number为1,cleanLine为-vinc-=-vict-胜，征服

    
    // 继续识别cleanline中的词根变体和含义,将词根变体和含义保存在rootInfo对象中,例如-vinc-=-vict-胜，征服,则roots为{变体1:"vinc",变体2:"vict"},meaning为"胜，征服"

    
    const rootParts = cleanLine.split(/[，,]/);
    const rootInfo = {
        number: line.match(/^\d+/)?.[0] || '',
        roots: [],
        meaning: '',
        etymology: '',
        extended: ''
    };
    
    // 处理每个词根变体
    for (const part of rootParts) {
        const { variants, meaning } = processRootVariants(part.trim());
        rootInfo.roots.push(...variants);
        if (meaning) {
            rootInfo.meaning += (rootInfo.meaning ? '，' : '') + meaning;
        }
    }
    
    return rootInfo;
}

/**
 * 主处理函数
 */
function processWordRoots() {
    const content = readFileContent('word_roots.txt');
    if (!content) {
        return;
    }

    const lines = content.split('\n');
    const roots = [];
    let currentRoot = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // 检查是否为词根行（以数字开头）
        if (/^\d+\./.test(line)) {
            if (currentRoot) {
                roots.push(currentRoot);
            }
            currentRoot = processRootEntry(line);
        } 
        // 检查是否为词源说明
        else if (line.startsWith('【词源】')) {
            if (currentRoot) {
                currentRoot.etymology = line.replace('【词源】', '').trim();
            }
        }
        // 检查是否为引申义
        else if (line.startsWith('【引申】')) {
            if (currentRoot) {
                currentRoot.extended = line.replace('【引申】', '').trim();
            }
        }
        // 其他行可能是单词例子，暂时忽略
    }

    // 添加最后一个词根
    if (currentRoot) {
        roots.push(currentRoot);
    }

    // 保存处理结果
    try {
        fs.writeFileSync(
            'processed_roots.json', 
            JSON.stringify(roots, null, 2),
            'utf8'
        );
        console.log('处理完成！结果已保存到 processed_roots.json');
    } catch (error) {
        console.error('保存结果失败:', error.message);
    }
}

// 运行处理程序
processWordRoots();