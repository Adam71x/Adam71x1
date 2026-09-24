# Export Omi Action Items to todo.txt

Use this recipe to turn action items captured by your Omi device into [todo.txt](https://github.com/todotxt/todo.txt) lines. todo.txt is a plain-text task format. You can open it in `todo.sh`, Simpletask (Android), SwiftoDo (iOS), sleek (desktop), topydo, and plugins for Vim, VS Code, and Obsidian.

---

## Prerequisites

```sh
pip install omi-cli
omi auth login
omi action-item list   # confirm you can see your items
```

The converter uses only the Python standard library. It needs no other packages.

---

## Quickstart

### 1. Print todo.txt lines to stdout

```sh
omi --json action-item list | python action_items_to_todotxt.py -
```

### 2. Write to a todo.txt file

```sh
omi --json action-item list | python action_items_to_todotxt.py - --output ~/todo/todo.txt
```

### 3. Sync without duplicates (safe to run from cron)

`--merge` keeps every line already in the file, including tasks you added by hand. It appends only Omi items whose `omi:<id>` tag is not in the file yet:

```sh
omi --json action-item list --open | python action_items_to_todotxt.py - --status open --output ~/todo/todo.txt --merge
```

### 4. Use your own project tag

```sh
omi --json action-item list | python action_items_to_todotxt.py - --project Work
```

---

## Field mapping

| Omi field | todo.txt token | Notes |
| :--- | :--- | :--- |
| `completed: true` | leading `x` | Adds the completion date too, when `completed_at` (or `updated_at`) is present |
| `created_at` | creation date `YYYY-MM-DD` | Converted to UTC |
| `description` | task text | Whitespace and newlines collapse to single spaces. A leading `x `, `(A) ` or date gets a `- ` prefix, so parsers don't misread it |
| `due_at` | `due:YYYY-MM-DD` | The widely supported `due:` extension |
| `conversation_id` | `conv:<id>` | Tag that links back to the source conversation |
| `id` | `omi:<id>` | Used by `--merge` to skip items already in the file |
| *(constant)* | `+omi` | Change it with `--project`, or pass `--project ""` to leave it out |

### Sample output

```text
2026-09-20 Email the investor update +omi due:2026-09-25 conv:conv_abc omi:act_1
x 2026-09-21 2026-09-18 Book dentist +omi omi:act_2
```

---

## CLI options

| Option | Description | Default |
| :--- | :--- | :--- |
| `input` | JSON file path, or `-` for stdin. Takes a list, `{"items": [...]}` or `{"action_items": [...]}` | *(required)* |
| `--output`, `-o` | Path to write the todo.txt file to | stdout |
| `--merge` | Append only new `omi:<id>` items to `--output` | off |
| `--status` | `all`, `open`, or `completed` | `all` |
| `--project` | `+project` tag added to each line | `omi` |

---

## Tests

```sh
python -m unittest test_action_items_to_todotxt -v   # 12 tests, stdlib only
```

## Design notes

- No third-party dependencies.
- Reads UTF-8 input that starts with a BOM, which Windows PowerShell pipes often add.
- Tag values are reduced to `[A-Za-z0-9_-]`, so a stray space or colon can't break todo.txt parsing.
- Follows the todo.txt spec for dates on completed items: the completion date comes first, then the creation date. The completion date is written only when both dates are known.
