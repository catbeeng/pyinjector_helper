# py_ast_dump.py
import ast
import sys
import json

class ASTEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ast.AST):
            return {k: self.default(v) for k, v in ast.iter_fields(obj)}
        elif isinstance(obj, list):
            return [self.default(v) for v in obj]
        elif isinstance(obj, (str, int, float, type(None), bool)):
            return obj
        else:
            return str(obj)

def main():
    filepath = sys.argv[1]
    with open(filepath, "r", encoding="utf-8") as f:
        source = f.read()

    tree = ast.parse(source, filename=filepath)
    json_output = json.dumps(tree, cls=ASTEncoder, indent=2)
    print(json_output)

if __name__ == "__main__":
    main()
