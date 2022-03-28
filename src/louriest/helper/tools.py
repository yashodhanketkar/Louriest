"""name: tools
version: 1.0.1
description: Extra functions for server
development python version: 3.10.1
"""


from googlesearch import search
from helper.modding import bad_word


def google_search(*q):
    """Search google for query with 'googlesearch' module

    Args:
        q: String argument/Tuple of arguments

    return:
        None if check is false else res string
    """
    res = ""
    query = ""
    for word in q:
        query += word + " "
    word = " " + query
    check, offence = bad_word(word)
    if check:
        return None
    else:
        for item in search(query, tld="com", start=1, stop=1):
            res = item
        return res


if __name__ == "__main__":
    pass
