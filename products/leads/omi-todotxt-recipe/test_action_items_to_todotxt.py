import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import action_items_to_todotxt as t  # noqa: E402


OPEN = {"id": "act_1", "description": "Email the investor update", "completed": False,
        "created_at": "2026-09-20T10:00:00Z", "due_at": "2026-09-25T18:00:00+02:00",
        "conversation_id": "conv_abc"}
DONE = {"id": "act_2", "description": "Book dentist", "completed": True,
        "created_at": "2026-09-18T09:00:00Z", "completed_at": "2026-09-21T12:00:00Z"}


class FormatTests(unittest.TestCase):
    def test_open_item(self):
        self.assertEqual(
            t.format_item(OPEN),
            "2026-09-20 Email the investor update +omi due:2026-09-25 conv:conv_abc omi:act_1",
        )

    def test_completed_item_has_completion_then_creation_date(self):
        self.assertEqual(t.format_item(DONE), "x 2026-09-21 2026-09-18 Book dentist +omi omi:act_2")

    def test_completed_without_created_omits_dates(self):
        self.assertEqual(t.format_item({"id": "a", "description": "d", "completed": True,
                                        "completed_at": "2026-09-21T00:00:00Z"}), "x d +omi omi:a")

    def test_description_newlines_collapsed(self):
        self.assertIn("line one line two", t.format_item({"description": "line one\n  line two"}))

    def test_reserved_prefixes_escaped(self):
        self.assertTrue(t.format_item({"description": "x marks the spot"}).startswith("- x marks"))
        self.assertTrue(t.format_item({"description": "(A) urgent"}).startswith("- (A) urgent"))
        self.assertTrue(t.format_item({"description": "2026-01-01 plan"}).startswith("- 2026-01-01"))

    def test_empty_description(self):
        self.assertTrue(t.format_item({}).startswith("Untitled action item"))

    def test_tags_are_sanitised(self):
        line = t.format_item({"id": "a b:c", "description": "d", "conversation_id": "x y"}, project="My Proj")
        self.assertIn("omi:abc", line)
        self.assertIn("conv:xy", line)
        self.assertIn("+MyProj", line)

    def test_empty_project_omitted(self):
        self.assertNotIn("+", t.format_item({"description": "d"}, project=""))

    def test_invalid_dates_ignored(self):
        self.assertEqual(t.format_item({"description": "d", "due_at": "soon", "created_at": 5}), "d +omi")


class MergeTests(unittest.TestCase):
    def test_merge_skips_existing_ids(self):
        prev = ["2026-09-20 Email the investor update +omi omi:act_1", "(A) my own task"]
        out = t.build_output([OPEN, DONE], "omi", prev)
        self.assertEqual(len(out), 3)
        self.assertEqual(out[:2], prev)
        self.assertIn("omi:act_2", out[2])


class CliTests(unittest.TestCase):
    def test_file_roundtrip_with_bom_and_wrapper(self):
        with tempfile.TemporaryDirectory() as d:
            src = Path(d) / "in.json"
            src.write_text("﻿" + json.dumps({"items": [OPEN, DONE]}), encoding="utf-8")
            out = Path(d) / "todo.txt"
            self.assertEqual(t.main([str(src), "-o", str(out), "--status", "open"]), 0)
            self.assertEqual(out.read_text(encoding="utf-8").count("\n"), 1)
            # merge twice -> no duplicates
            t.main([str(src), "-o", str(out), "--merge"])
            t.main([str(src), "-o", str(out), "--merge"])
            self.assertEqual(len(out.read_text(encoding="utf-8").splitlines()), 2)

    def test_merge_requires_output(self):
        with tempfile.TemporaryDirectory() as d:
            src = Path(d) / "in.json"
            src.write_text("[]", encoding="utf-8")
            self.assertEqual(t.main([str(src), "--merge"]), 2)


if __name__ == "__main__":
    unittest.main()
