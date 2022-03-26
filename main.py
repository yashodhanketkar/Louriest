"""
Copyright [2020] [Yashodhan Ketkar]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""


import os
import asyncio
import logging
from discord.ext import commands


###############################################################################
# Requirements Gathering
###############################################################################


TOKEN = os.environ["Louriest_Token"]
# make bot respond to command with ! prefix
# example: !foo
bot = commands.Bot(command_prefix="!")


###############################################################################
# Helper Functions
###############################################################################


def bad_word(*q):
    """
    Check if bad word/s is/are present in user query
    :param q: String argument/tuple of arguments
    :return: Boolean
    """
    res = ""
    offence = []
    with open(".data/block_words.txt") as f:
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
    with open(".data/block_words.txt", "a") as f:
        print(q)
        f.write(q + "\n")


def google_search(*q):
    """
    Search google for query with 'googlesearch' module
    :param q: String argument/Tuple of arguments
    :return: generator/string
    """
    res = ""
    from googlesearch import search

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


async def test(c):
    print(f"hello x {c}")
    await asyncio.sleep(30)


###############################################################################
# Logging
###############################################################################


logger = logging.getLogger("discord")
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename="logs/discord.log", encoding="utf-8", mode="w")
handler.setFormatter(
    logging.Formatter(
        "%(asctime)s - %(threadName)s - %(name)s - %(levelname)s - %(message)s"
    )
)
logger.addHandler(handler)


###############################################################################
# Bot events
###############################################################################


@bot.event
async def on_ready():
    """
    Print message when bot is online
    :return: None
    """
    print(f"We have logged in as {bot.user.name}")


@bot.event
async def on_message(message):
    """
    Stops bot from replying to own commands
    :param message: Input from discord channel
    :return: None
    """
    if message.author == bot.user:
        pass
    check, offence = bad_word(" " + message.content)
    if check:
        if len(offence) > 1:
            await message.author.send(
                f"Warning: Word/s {offence} is/are" " banned from chat\n",
                f"Original message: {message.content}",
            )
        else:
            await message.author.send(
                f"Warning: Word {offence} is banned"
                " from chat\n"
                f"Original message: {message.content}"
            )
        await message.delete()
    await bot.process_commands(message)


###############################################################################
# Bot commands
###############################################################################


@bot.command(name="hello")
async def greet(ctx):
    """
    Greets user with name
    :param ctx: Context
    :return: None
    """
    await ctx.send(f"Hello {ctx.author.name}, I'm {bot.user.name}")


@bot.command(name="ping")
async def ping(ctx):
    """
    Send message to channel with current ping
    :param ctx: Context
    :return: None
    """
    if bot.latency > 1:
        await ctx.send(f"Ping to server is {int(bot.latency)}ms")
    else:
        await ctx.send("Ping to server is 1ms")


@bot.command(name="clear")
async def clear(ctx, amt=None):
    """
    Clear the messages from current channel if user have special permissions
    :param ctx: Context
    :param amt: Number of message to be deleted
    :return: None
    """
    if not ctx.author.guild_permissions.administrator:
        return None
    if amt:
        if amt.isnumeric():
            amt = int(amt)
            # clear specified number of messages(amt)
            if amt != 0:
                await ctx.send(f"Clearing {amt} messages")
                await ctx.channel.purge(limit=amt + 2)
        else:
            # clear all messages from channel
            if amt == "all":
                await ctx.send("Clearing all messages")
                await ctx.channel.purge()
            else:
                await ctx.send("This command is not available")
    else:
        await ctx.send("Clearing 1 message")
        await ctx.channel.purge(limit=3)


@bot.command(name="search")
async def search(ctx, *q):
    """
    Get query for google search from user and sends google search result to
    respective discord channel
    :param ctx: context
    :param q: String argument/Tuple of arguments
    :return: None
    #"""
    res = google_search(*q)
    if res:
        await ctx.send(res)


@bot.command(name="ban_word")
async def ban_word(ctx, *arg):
    """
    Add words/phrase to server block list
    :param ctx: Context
    :param arg: String argument/Tuple of arguments
    :return: None
    """
    if not ctx.author.guild_permissions.administrator:
        return None
    if len(arg) == 0:
        await ctx.send("Please enter word/s to ban")
    elif len(arg) == 1:
        word = arg[0]
        add_bad_words(word)
        await ctx.send(f"Hello, the word: '{word}' is banned from chat")
    else:
        phrase = ""
        for item in arg:
            phrase += item + " "
        add_bad_words(phrase)
        await ctx.send(f"Hello, the phrase: '{phrase}' is banned from chat")


###############################################################################
# Local Machine Execution Special Functions
###############################################################################


@bot.command(name="shutdown")
async def shutdown(ctx):
    """
    Terminate bot process and logout from server
    :param ctx: context
    :return: None
    """
    if ctx.author.guild_permissions.administrator:
        await ctx.send("Goodbye")
        await ctx.bot.close()


###############################################################################
# Execution
###############################################################################


# runs the bot
bot.run(TOKEN)
