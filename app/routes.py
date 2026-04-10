import os
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def some_function(param):
    """
    This function does something with the parameter.
    """
    try:
        # function logic here
        pass
    except Exception as e:
        logger.error("An error occurred: %s", str(e))


def another_function():
    """
    This function does something else.
    """
    try:
        # function logic here
        pass
    except Exception as e:
        logger.error("An error occurred: %s", str(e))

