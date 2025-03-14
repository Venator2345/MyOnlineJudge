import sys

user_code = sys.argv[1]
user_input = sys.stdin.read()

# Divide as linhas e cria um iterador
input_lines = user_input.splitlines()  # ou split("\n"), mas splitlines() é mais robusto
input_index = 0

# Função input() que avança nas linhas
def custom_input():
    global input_index
    if input_index < len(input_lines):
        line = input_lines[input_index]
        input_index += 1
        return line
    return ""  # Retorna vazio se acabar as linhas

exec_globals = {"input": custom_input}

try:
    exec(user_code, exec_globals)
except Exception as e:
    sys.exit(1)