import sys

user_code = sys.argv[1]
user_input = sys.stdin.read()
exec_globals = {"input": lambda: user_input.split("\n").pop(0)}

try:
    exec(user_code, exec_globals)
except Exception as e:
    print(f"Erro: {str(e)}")