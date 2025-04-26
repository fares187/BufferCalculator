using BufferCalculator.Service;
using Microsoft.Extensions.Logging;

namespace BufferCalculator
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");

                    fonts.AddFont("Roboto-Thin.ttf", "Roboto");
                    fonts.AddFont("Roboto-Regular.ttf", "Roboto-Bold");
                });

            builder.Services.AddMauiBlazorWebView();
            builder.Services.AddSingleton<IKeyEventService, KeyEventService>();
            builder.Services.AddSingleton<MainPage>();
#if DEBUG
            builder.Services.AddBlazorWebViewDeveloperTools();
    		builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}
