"""
name :: helper functions
version :: 1.0.1
description :: module consists of helper function of louriest discord bot
development python version :: 3.10.1
"""


from googlesearch import search


def bad_word(*q):
    """
    Check if bad word/s is/are present in user query
    :param q: String argument/tuple of arguments
    :return: Boolean
    """
    res = ""
    offence = []
    with open("data/block_words.txt") as f:
        b = f.readlines()
    for item in q:
        res += item + " "
    for item in b:
        item_rep = " " + item.replace("\n", "")
        if item_rep in res:
            offence.append(item_rep)
            print(item_rep)
    if len(offence) == 0:
        return False, offence
    return True, offence


def add_bad_words(q):
    """
    Write bad words to block words file
    :param q: String argument/Tuple of arguments
    :return: None
    """
    if bad_word(q):
        return None
    with open("data/block_words.txt", "a") as f:
        print(q)
        f.write(q + "\n")


def google_search(*q):
    """
    Search google for query with 'googlesearch' module
    :param q: String argument/Tuple of arguments
    :return: generator/string
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
        for item in search(query, tld="com", start=1, stop=3):
            res += item
        return res
