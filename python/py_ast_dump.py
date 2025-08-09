# py_ast_dump.py
import ast
import sys
import json
from pathlib import Path


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


def parse_file(filepath: Path):
    with open(filepath, "r", encoding="utf-8") as f:
        source = f.read()
    tree = ast.parse(source, filename=str(filepath))
    return {"path": str(filepath), "ast": tree}


def main():
    files = [Path(arg) for arg in sys.argv[1:]]
    results = [parse_file(f) for f in files]
    print(json.dumps(results, cls=ASTEncoder))


if __name__ == "__main__":
    main()
