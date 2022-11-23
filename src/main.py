"""name: louriest discord bot
version: 2.1.1
description: main module of discord bot
development python version: 3.10.1
"""

import os
import asyncio

from discord.ext import commands
import discord
import helper

TOKEN = os.environ["Louriest_Token"]
bot = commands.Bot(command_prefix="!", intents = discord.Intents.all(), application_id = "582869002120986635")
bot.remove_command("help")

helper.generate_log()

async def main():
    async with bot:
        await bot.load_extension("cogs.maincog")
        await bot.load_extension("cogs.systemcog")
        await bot.load_extension("cogs.slcocog")
        await bot.start(TOKEN)

if __name__ == "__main__":
    asyncio.run(main())