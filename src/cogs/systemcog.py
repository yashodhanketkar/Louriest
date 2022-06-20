"""name: system cog
version: 1.0.1
description: Contains system commands for local server runtime
python version: 3.10.1
"""

import os
import sys

from discord.ext import commands


class SystemCog(commands.Cog):
    """This cog file consist of system functions for windows system

    Args:
        commands.Cog

    Methods:
        shutdown(ctx):
            Terminate bot process

        restart(ctx):
            Terminate bot and start new bot process
    """

    available_cogs = [
        "louriest",
    ]

    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="shutdown")
    async def shutdown(self, ctx):
        """Terminate bot process and logout from server

        Args:
            ctx (context): Context from command
        """
        if ctx.author.guild_permissions.administrator:
            await ctx.send("Goodbye")
            await ctx.channel.purge(limit=2)
            await ctx.bot.close()

    @commands.command(name="restart")
    async def restart(self, ctx):
        """Terminate current bot process and start new one

        Args:
            ctx (context): Context from command
        """
        if ctx.author.guild_permissions.administrator:
            await os.execv(sys.executable, ["python"] + sys.argv)

    @commands.command(name="load")
    async def load(self, ctx):
        """Load user specified extension/cog if present

        Arg:
            ctx (context): Context from command
        """
        if not ctx.author.guild_permissions.administrator:
            return None
        cog_asked = ctx.message.content.replace("!load ", "")
        if cog_asked in self.available_cogs:
            try:
                self.bot.load_extension(f"cogs.{cog_asked}cog")
                await ctx.send(f"{cog_asked} extension successfully loaded")
            except commands.ExtensionAlreadyLoaded:
                await ctx.send(
                    "Extension is already loaded please use following commands\
                    ```\n!unload <extension> # to unload extension use\
                    \n!reload <extension> # to reload extension use```"
                )

    @commands.command(name="unload")
    async def unload(self, ctx):
        """Unload user specified extension/cog if present

        Arg:
            ctx (context): Context from command
        """
        if not ctx.author.guild_permissions.administrator:
            return None
        cog_asked = ctx.message.content.replace("!unload ", "")
        if cog_asked in self.available_cogs:
            try:
                self.bot.unload_extension(f"cogs.{cog_asked}cog")
                await ctx.send(f"{cog_asked} extension successfully unloaded")
            except commands.ExtensionNotLoaded:
                await ctx.send(
                    "Extension is not loaded\
                    ```\n!load <extension> # to load extension use```"
                )

    @commands.command(name="reload")
    async def reload(self, ctx):
        """Reload user specified extension/cog if present

        Arg:
            ctx (context): Context from command
        """
        if not ctx.author.guild_permissions.administrator:
            return None
        cog_asked = ctx.message.content.replace("!reload ", "")
        if cog_asked in self.available_cogs:
            try:
                self.bot.reload_extension(f"cogs.{cog_asked}cog")
                await ctx.send(f"{cog_asked} extension successfully reloaded")
            except commands.ExtensionNotLoaded:
                await ctx.send(
                    "Extension is not loaded\
                    ```\n!load <extension> # to load extension use```"
                )


def setup(bot):
    """Setting up system cog"""
    bot.add_cog(SystemCog(bot))


if __name__ == "__main__":
    ...
