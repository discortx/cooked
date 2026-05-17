import re
import random

file_path = r"d:\P\Projects\cooked\login.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

texts = [
    "Настоящим вы соглашаетесь с тем, что ваши данные будут переданы третьим лицам без вашего ведома.",
    "Этот раздел намеренно оставлен непонятным для усложнения процесса.",
    "Любые попытки понять этот текст приведут к немедленному аннулированию вашей лицензии.",
    "Ваша душа теперь является собственностью нашей корпорации, по крайней мере, до выхода из системы.",
    "Мы оставляем за собой право судить вас, основываясь на вашем поведении.",
    "귀하는 이 약관을 읽지 않고 동의했음을 인정합니다.",
    "당사는 귀하의 브라우징 기록을 기반으로 귀하의 성격을 판단할 권리가 있습니다.",
    "이 조항은 법적 효력이 없지만, 우리는 여전히 귀하가 이것을 준수하기를 기대합니다.",
    "우리는 이유 없이 귀하의 계정을 해지할 수 있습니다. 이것은 농담이 아닙니다.",
    "당신의 친구들도 이제 우리의 알고리즘에 의해 평가받게 됩니다.",
    "あなたは当社のサービスを利用することにより、魂の所有権を放棄することに同意するものとします。",
    "このテキストは、あなたがどれだけ長くスクロールできるかをテストするためだけに存在します。",
    "私たちのシステムはあなたの瞬きを監視しており、4回以上瞬きをすると警告が送信されます。",
    "このセクションは意図的に敵対的です。理由はありません。",
    "あなたのオーラが私たちのカラースキームと一致しない場合、アクセスは拒否されます。",
    "我们保留在不通知您的情况下随时更改此协议的权利。",
    "您的所有个人信息都将用于训练我们的AI模型，这毫无疑问会让您感到不安。",
    "如果您阅读到了这里，说明您有太多的空闲时间。",
    "任何试图寻找此文档逻辑的行为都将被视为违约。",
    "我们不仅评判您，我们还通过您认识的人来评判您。"
]

def replacer(match):
    if random.random() < 0.65: # 65% chance to replace
        new_text = random.choice(texts)
        return f"<p>{new_text}</p>"
    return match.group(0)

# The terms start around line 1250, so we should only replace <p>...</p> that are in that big section.
# We can find the start index of 'SECTION 1:' or similar.
# Let's just find the index of "CLAUSE &amp; LOGIN METAPHYSICS" (around line 1350)
start_idx = content.find("CLAUSE &amp; LOGIN METAPHYSICS")
if start_idx == -1:
    start_idx = content.find("SECTION")

# And we can replace <p> tags until the end of the terms.
# Let's just apply the regex from start_idx to the end of the file.
# The end of the terms is likely right before the script tag or the end of the template.
end_idx = content.find("<script", start_idx)
if end_idx == -1:
    end_idx = len(content)

before = content[:start_idx]
to_process = content[start_idx:end_idx]
after = content[end_idx:]

# Regex to match <p>...</p>. We have to be careful with multi-line paragraphs.
# <p> followed by any character (non-greedy) until </p>
processed = re.sub(r"<p>.*?</p>", replacer, to_process, flags=re.DOTALL)

new_content = before + processed + after

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done replacing.")
