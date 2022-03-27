"""
name :: louriest discord bot
version :: 2.0.1
description :: main module of discord bot
development python version :: 3.10.1
"""


import logging
import os

from discord import Embed
from discord.ext import commands
from helper import add_bad_words, bad_word, google_search

TOKEN = os.environ["Louriest_Token"]
bot = commands.Bot(command_prefix="!")
bot.remove_command('help')


logger = logging.getLogger("discord")
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(
    filename="discord.log",
    encoding="utf-8",
    mode="w"
)
handler.setFormatter(
    logging.Formatter(
        "%(asctime)s - %(threadName)s - %(name)s - %(levelname)s - %(message)s"
    )
)
logger.addHandler(handler)


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
        await message.author.send(
            f"Inappropriate terms in message: {message.content}",
        )
        await message.delete()
    await bot.process_commands(message)


@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        await ctx.send(f"Sorry {ctx.author.name}, this command is not valid!")
        return
    raise error


@bot.command(name="help")
async def help(ctx):
    """
    Show commands to users
    :param ctx: Context
    :return: None
    """
    embed = Embed(
        title="title"
    )
    embed.set_author(name=bot.user.name)
    return await ctx.send(embed=embed)


@bot.command(name="hello")
async def greet(ctx):
    """
    Greets user with name
    :param ctx: Context
    :return: None
    """
    await ctx.send(f"Hello {ctx.author.name}, I'm {bot.user.name}")


@bot.command(name="nqn")
async def help_nqn(ctx):
    """
    Shows nqn tag
    :param ctx: Context
    :return: None
    """
    await ctx.send("Please use '-n help' to call nqn bot")


@bot.command(name="louriest")
async def lou_hello(ctx):
    """
    Say custom hello with help of nqn bot
    :param ctx: Context
    :return: None
    """
    await ctx.channel.purge(limit=1)
    await ctx.send(
        "https://cdn.discordapp.com/emojis/758007359531515945.gif"
    )


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


bot.run(TOKEN)
