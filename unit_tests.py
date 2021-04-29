"""
Mock tests for app.py
"""
import unittest
import unittest.mock as mock
from unittest.mock import patch
import sys
import os

import models

from stock_transaction_implementation import (
    ErrorMessages,
    poll_stock_implementation,
    request_user_stock_info_implementation,
)

TEST_STOCK_NAME = "AAPL"
FAILURE_STOCK_NAME = "STONKS"
TEST_STOCK_PRICE = 404.00
TEST_STOCK_AVG_PRICE = 200.00
TEST_STOCK_QUANTITY = 69

poll_stock_test_name = "poll_stock_implementation"
request_user_stock_test_name = "request_user_stock_info_implementation"

DB_USERNAME_ID_KEY = "username_id"
DB_CASH_BALANCE_KEY = "cash_balance"
DB_TICKER_KEY = "ticker"
DB_AVG_PRICE_KEY = "avg_price"
DB_QUANTITY_KEY = "quantity"

FUNCTION_INPUT_TICKER = "ticker_symbol"
FUNCTION_INPUT_USER_ID = "user_id"

BOTH_FUNCTION_OUTPUT_ERROR_KEY = "error"

POLL_STOCK_OUTPUT_SUGGESTIVE_MAX_KEY = "suggestive_max"
IRRELEVANT_SUGGESTIVE_MAX_VALUE = 100000

USER_STOCK_OUTPUT_QUANTITY = "quantity"
USER_STOCK_OUTPUT_AVG_PRICE = "avg_price"

DEAD_DB_OBJ = None


class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.user_data = [
            {DB_USERNAME_ID_KEY: 0, DB_CASH_BALANCE_KEY: 100},
            {DB_USERNAME_ID_KEY: 1, DB_CASH_BALANCE_KEY: 1000},
        ]
        self.stock_data = [
            {
                DB_USERNAME_ID_KEY: 0,
                DB_TICKER_KEY: TEST_STOCK_NAME,
                DB_AVG_PRICE_KEY: TEST_STOCK_AVG_PRICE,
                DB_QUANTITY_KEY: TEST_STOCK_QUANTITY,
            }
        ]

        self.test_params = {
            poll_stock_test_name: [
                {FUNCTION_INPUT_TICKER: TEST_STOCK_NAME},
                {FUNCTION_INPUT_TICKER: FAILURE_STOCK_NAME},
            ],
            request_user_stock_test_name: [
                {FUNCTION_INPUT_USER_ID: 0, FUNCTION_INPUT_TICKER: TEST_STOCK_NAME},
                {FUNCTION_INPUT_USER_ID: 1, FUNCTION_INPUT_TICKER: TEST_STOCK_NAME},
            ],
        }

        self.test_results = {
            poll_stock_test_name: [
                {
                    TEST_STOCK_NAME: TEST_STOCK_PRICE,
                    POLL_STOCK_OUTPUT_SUGGESTIVE_MAX_KEY: IRRELEVANT_SUGGESTIVE_MAX_VALUE,
                },
                {BOTH_FUNCTION_OUTPUT_ERROR_KEY: ErrorMessages.INVALID_STOCK},
            ],
            request_user_stock_test_name: [
                {
                    USER_STOCK_OUTPUT_QUANTITY: TEST_STOCK_QUANTITY,
                    USER_STOCK_OUTPUT_AVG_PRICE: TEST_STOCK_AVG_PRICE,
                },
                {USER_STOCK_OUTPUT_QUANTITY: 0},
            ],
        }

    def mock_helper_get_stock_price(self, stock_name):
        if stock_name == TEST_STOCK_NAME:
            return TEST_STOCK_PRICE
        return None

    def test_poll_stock_test(self):
        with patch(
            "stock_transaction_implementation.helper_get_stock_price",
            self.mock_helper_get_stock_price,
        ):
            test_name = poll_stock_test_name
            for test_idx in range(len(self.test_params[test_name])):
                data_input = self.test_params[test_name][test_idx]

                output = poll_stock_implementation(data_input, DEAD_DB_OBJ)

                expected_result = self.test_results[test_name][test_idx]

                self.assertEqual(output, expected_result)

    def test_user_stock_test(self):
        with patch(
            "stock_transaction_implementation.helper_get_stock_price",
            self.mock_helper_get_stock_price,
        ):
            test_name = poll_stock_test_name
            for test_idx in range(len(self.test_params[test_name])):
                data_input = self.test_params[test_name][test_idx]

                output = poll_stock_implementation(data_input, DEAD_DB_OBJ)

                expected_result = self.test_results[test_name][test_idx]

                self.assertEqual(output, expected_result)


if __name__ == "__main__":
    unittest.main()
