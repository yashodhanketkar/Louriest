"""name: louriest discord bot
version: 2.1.1
description: main module of discord bot
development python version: 3.10.1
"""

import os

from discord.ext import commands
import helper

TOKEN = os.environ["Louriest_Token"]
bot = commands.Bot(command_prefix="!")
bot.remove_command("help")

helper.generate_log()

bot.load_extension("cogs.maincog")
bot.load_extension("cogs.systemcog")


bot.run(TOKEN)
