# KendoReactEFCoreDemo
A demo that shows how to use the Kendo Grid with EntityFramework backend.

To run the example:

1. Open the solution in Visual Studio
    - The solution has two projects; the React project (client), the .NET project (server)
2. Open the React project's folder in Terminal and run `npm install` to restore its dependenices
3. Do a Rebuild on the server project
    - Note, it has a Telerik dependency, make sure you have the Telerik NuGet server in your Visual Studio package sources ([follow one-time instructions here](https://docs.telerik.com/aspnet-core/installation/nuget-install#setup-with-the-nuget-package-manager))
4. Start Debugging

Behavior

- Watch the .NET project launch in its own browser instance. This is the REST service, running on its own port.
- Watch the command window open, notice the client app's URL appear. You can use Ctrl+Click to open the client app, or manually copy/paste it into another browser tab
