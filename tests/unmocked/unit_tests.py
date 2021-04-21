"""
Mock tests for app.py
"""
import unittest
import unittest.mock as mock
from unittest.mock import patch
import sys
import os


sys.path.append(os.path.abspath("../../"))
sys.path.append(os.path.abspath(""))
import models

from app import format_leaderboard

USERNAME_INPUT = "username"
USERS_INPUT = "users"
EXPECTED_OUTPUT = "expected"
INITIAL_USER1 = models.Player(username="User1", score=120)
INITIAL_USER2 = models.Player(username="User2", score=101)


class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        db = [INITIAL_USER1, INITIAL_USER2]
        db2 = [INITIAL_USER3, INITIAL_USER4]
        db3 = [INITIAL_USER5, INITIAL_USER6]
        self.success_test_params = [
            {USERS_INPUT: db, EXPECTED_OUTPUT: [["User1", 120], ["User2", 101]]},
            {USERS_INPUT: db3, EXPECTED_OUTPUT: [["User5", 100], ["User6", 101]]},
            {USERS_INPUT: db2, EXPECTED_OUTPUT: [["User1", 121], ["User2", 102]]},
            # TODO add another test case
        ]

    def test_add_user(self):
        for test in self.success_test_params:
            # TODO: Make a call to add user with your test inputs
            # then assign it to a variable
            actual_result = format_leaderboard(test[USERS_INPUT])

            # Assign the expected output as a variable from test
            expected_result = test[EXPECTED_OUTPUT]

            # Use assert checks to see compare values of the results
            # self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result, expected_result)


if __name__ == "__main__":
    unittest.main()
