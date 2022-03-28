"""name: modding functions
version: 1.0.1
description: Consists of some modding functions
development python version: 3.10.1
"""


def bad_word(*q):
    """Check if bad word/s is/are present in user query

    Args:
        q: String argument/tuple of arguments
    return:
        offence_present: Boolean value
        offence: List of offensive words
    """
    res = ""
    offence_present = True
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
        offence_present = False
    return offence_present, offence


def add_bad_words(q):
    """Add words to block words file

    Args:
        q: String argument/Tuple of arguments
    """
    if bad_word(q):
        return None
    with open("data/block_words.txt", "a") as f:
        print(q)
        f.write(q + "\n")


if __name__ == "__main__":
    pass
