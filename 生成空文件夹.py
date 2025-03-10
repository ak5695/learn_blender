import os

# 3D场景名称清单
scenes = [
    "古代集市",
    "神秘森林",
    "太空殖民地",
    "天空之城",
    "火山要塞",
    "中世纪庄园",
    "古罗马城市",
    "生命之树",
    "时间守护者钟塔",
    "智慧图书馆",
    "文艺复兴大师的工作坊",
    "自然之心的元素圣殿"
]

# 获取当前工作目录
current_dir = os.getcwd()

# 遍历场景列表
for i, scene in enumerate(scenes, start=1):
    # 生成文件夹名称
    folder_name = f"{i}.{scene}"
    # 拼接文件夹的完整路径
    folder_path = os.path.join(current_dir, folder_name)
    # 创建文件夹
    try:
        os.makedirs(folder_path)
        print(f"成功创建文件夹: {folder_path}")
    except FileExistsError:
        print(f"文件夹 {folder_path} 已存在。")