export class CommandLineHandler
{
    public static printWelcomeText()
    {
        console.log();
        console.log("Welcome to the Parts of Speech Tagger playground for CSE 390");
        console.log("---------------------------------------------------------");
    }

    public static printHelpText()
    {
        console.log();
        console.log("Available commands:");
        console.log("---------------------------------------------------------");
        console.log(CommandLineHandler.writeHelpLine("help", "Print this help text"));
        console.log();
        console.log(CommandLineHandler.writeHelpLine("exit", "Exit Application"));
        console.log();
    }

    private static writeHelpLine(command, text, tabs?)
    {
        tabs = tabs || 4;

        var tabsString = (function ()
        {
            var s = "";
            for (let i = 0; i < tabs; i++)
            {
                s += "\t";
            }
            return s;
        })();

        return command + tabsString + text;
    };
}