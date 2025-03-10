import pandas as pd

# 读取word_roots.csv文件
df = pd.read_csv('word_roots.csv', header=None, names=['original_data'])

# 定义空列表来存储处理后的数据
processed_data = []

# 定义一些常见的前缀和后缀
prefixes = ['pro', 'con', 'ex', 'un', 'neo', 'post', 'in', 'ev']
suffixes = ['ion', 'ive', 'ly', 'less', 'ize', 'ed', 'ing', 'al', 'ity', 'ism']

# 遍历每一行数据
for index, row in df.iterrows():
    original_text = row['original_data']
    # 尝试提取单词、含义和读音
    parts = original_text.split()
    word = parts[0]
    meaning = ""
    phonetic = ""
    for part in parts[1:]:
        if part.startswith('[') and part.endswith(']'):
            phonetic = part[1:-1].replace('[', '/').replace(']', '/')
        else:
            meaning += part + " "
    meaning = meaning.strip()

    # 尝试判断主要词和衍生词
    is_main_word = True
    for prefix in prefixes:
        if word.startswith(prefix):
            is_main_word = False
            break
    for suffix in suffixes:
        if word.endswith(suffix):
            is_main_word = False
            break

    # 确定词根和变体
    root = ""
    variant = ""
    if "vinc" in word:
        root = "vinc/vict"
        variant = "vinc"
    elif "vict" in word:
        root = "vinc/vict"
        variant = "vict"

    # 构建处理后的数据行
    processed_row = {
        'Root': root,
        'Meaning': '胜，征服',
        'Category': 'other',
        'Variant': variant,
        'Main Word': word if is_main_word else "",
        'Main Word Meaning': meaning if is_main_word else "",
        'Main Word Phonetic': phonetic if is_main_word else "",
        'Derived Word': word if not is_main_word else "",
        'Derived Word Meaning': meaning if not is_main_word else "",
        'Derived Word Phonetic': phonetic if not is_main_word else ""
    }

    processed_data.append(processed_row)

# 将处理后的数据转换为DataFrame
result_df = pd.DataFrame(processed_data)

# 将结果保存为新的CSV文件
result_df.to_csv('processed_word_roots.csv', index=False)