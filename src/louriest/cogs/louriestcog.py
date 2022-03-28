"""name: louriest cog
version: 1.0.1
description: Contains personal commands
python version: 3.10.1
"""

from discord.ext import commands


class LouriestCog(commands.Cog):
    """This is personal cog for specific discord server and user

    Args:
        commands.Cog

    Methods:
        lou_hello(ctx):
            Sends preselected gif as message.
    """

    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="louriest")
    async def lou_hello(self, ctx):
        """Sends preselected gif as message

        Args:
            ctx: Context

        return:
            None
        """
        await ctx.channel.purge(limit=1)
        await ctx.send("https://cdn.discordapp.com/emojis/758007359531515945.gif")


def setup(bot):
    """Setting up louriestcog"""
    bot.add_cog(LouriestCog(bot))


if __name__ == "__main__":
    pass
