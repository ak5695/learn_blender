import pandas as pd
import json

# 读取 JSON 文件
with open('词库.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 初始化一个空列表，用于存储处理后的数据
rows = []

# 遍历 JSON 数据中的每个词根变体组
for item in data:
    # 获取含义和历史信息
    meaning = item['含义']
    history = '\n'.join(item['历史'])

    # 遍历每个词根变体
    for root, words in item['词根变体'].items():
        # 遍历每个单词
        for word_info in words:
            word = word_info['单词']
            pronunciation = word_info['读音']
            word_meaning = word_info['含义']
            # 将数据添加到 rows 列表中
            rows.append([root, word, pronunciation, word_meaning, meaning, history])

# 创建 DataFrame
df = pd.DataFrame(rows, columns=['词根变体', '单词', '读音', '单词含义', '词根含义', '词根历史'])

# 将 DataFrame 保存为 Excel 文件
df.to_excel('output.xlsx', index=False)