import pandas as pd
import json

# 读取 JSON 文件
with open('词库.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 初始化一个空列表，用于存储处理后的数据
rows = []

# 遍历 JSON 数据中的每个条目
for item in data:
    # 获取词根含义
    meaning = item['含义']
    # 拼接词根变体
    root_variants = []
    for root in item['词根变体'].keys():
        root_variants.append(root)
    combined_roots = ', '.join(root_variants)

    # 将数据添加到 rows 列表中
    rows.append([combined_roots, meaning])

# 创建 DataFrame
df = pd.DataFrame(rows, columns=['词根变体', '词根含义'])

# 将 DataFrame 保存为 Excel 文件
df.to_excel('output_combined.xlsx', index=False)