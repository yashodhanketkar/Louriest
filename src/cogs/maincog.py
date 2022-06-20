"""name: main cog
version: 1.0.1
description: Contains general commands
python version: 3.10.1
"""

from discord import Embed
from discord.ext import commands

from helper import add_bad_words, bad_word, google_search


class MainCog(commands.Cog):
    """This is main cog containing main functions of bot

    Args:
        commands.Cog

    Methods:
        on_ready():
            Print message when bot is online

        on_command_errors(ctx, error):
            Handles few errors

        on_message(message):
            Screens messages

        help(ctx):
            Show available commands to user

        greet(ctx):
            Greets users

        help_nqn(ctx):
            Shows NQNs server tag

        ping(ctx):
            Send message to channel with current ping

        clear(ctx, amt):
            Clear the messages

        search(ctx, *q):
            Search google for keywords

        ban_word(ctx, *arg):
            Add words/phrase to server block list
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        """Print messagge when bot is online"""
        print(f"We have logged in as {self.bot.user.name}")

    @commands.Cog.listener()
    async def on_command_error(self, ctx, error):
        """Handles errors

        Args:
            ctx (context): Context from command
            error (error): Error collected from listener function

        Raises:
            error: throws isinstance error if command is not avaliable
        """
        if isinstance(error, commands.CommandNotFound):
            await ctx.send(f"Sorry {ctx.author.name}, this command is not valid!")
            return
        raise error

    @commands.Cog.listener()
    async def on_message(self, message):
        """Screens messages. Does two things
            1. Stops bot from replying to own commands
            2. Filter blocked words and send warning to users

        Args:
            message (message): Input from discord channel
        """
        if message.author == self.bot.user:
            ...
        check, offence = bad_word(" " + message.content)
        if check:
            await message.author.send(
                f"Inappropriate terms in message: {message.content}",
            )
            await message.delete()
        # await bot.process_commands(message)

    @commands.command(name="help")
    async def help(self, ctx):
        """Show available commands to user

        Args:
            ctx (context): Context from command

        return:
            embed (Embed): Custom embed object
        """
        embed = Embed(title="title")
        embed.set_author(name=self.bot.user.name)
        embed.add_field(
            name="!help", value="Get list of help commands from bot", inline="True"
        )
        embed.add_field(name="!hello", value="Say hello to bot")
        return await ctx.send(embed=embed)

    @commands.command(name="hello")
    async def greet(self, ctx):
        """Greets users

        Args:
            ctx (context): Context from command
        """
        await ctx.send(f"Hello {ctx.author.name}, I'm {self.bot.user.name}")

    @commands.command(name="nqn")
    async def help_nqn(self, ctx):
        """Shows NQN tag

        Args:
            ctx (context): Context from command
        """
        await ctx.send("Please use '-n help' to call nqn bot")

    @commands.command(name="ping")
    async def ping(self, ctx):
        """Send message to channel with current ping

        Args:
            ctx (context): Context from command
        """
        if self.bot.latency > 1:
            await ctx.send(f"Ping to server is {int(self.bot.latency)}ms")
        else:
            await ctx.send("Ping to server is 1ms")

    @commands.command(name="clear")
    async def clear(self, ctx, amt=None):
        """Clear the messages from current channel if user have special
        permissions

        Args:
            ctx (context): Context from command
            amt (int, optional): Number of message to be deleted. Defaults to None.

        Returns:
            None: If author doesn't have authorization
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

    @commands.command(name="search")
    async def search(self, ctx, *q):
        """Get query for google search from user and sends google search
        result to respective discord channel

        Args:
            ctx (context): Context from command
            q (args): String argument/Tuple of arguments
        """
        res = google_search(*q)
        if res:
            await ctx.send(res)

    @commands.command(name="ban_word")
    async def ban_word(self, ctx, *arg):
        """Add words/phrase to server block list

        Args:
            ctx (context): Context from command
            arg (args): String argument/Tuple of arguments
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


def setup(bot):
    """Setting up maincog"""
    bot.add_cog(MainCog(bot))


if __name__ == "__main__":
    ...
