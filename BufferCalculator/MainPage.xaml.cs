using BufferCalculator.Service;

using Microsoft.Maui.Controls.PlatformConfiguration;


#if ANDROID
using Android.Views;
#endif

// For Windows
#if WINDOWS
using Microsoft.UI.Xaml.Input;
using System.Diagnostics;
using Windows.System;
#endif
namespace BufferCalculator
{
    public partial class MainPage : ContentPage
    {
        private readonly IKeyEventService _keyEventService;
        public MainPage(IKeyEventService keyEventService)
        {
            InitializeComponent();
            _keyEventService = keyEventService;
        }

#if ANDROID
        protected override void OnHandlerChanged()
        {
            base.OnHandlerChanged();
            if (Handler?.PlatformView is Android.Views.View view)
            {
                view.KeyPress += (sender, e) =>
                {
                    if (e.KeyCode == Keycode.DpadUp || e.KeyCode == Keycode.DpadDown)
                    {
                        _keyEventService.NotifyKeyPressed(new KeyPressedEventArgs(e.KeyCode.ToString()));
                        e.Handled = true;
                    }
                };
            }
        }
#endif

#if WINDOWS
        protected override void OnHandlerChanged()
        {
            base.OnHandlerChanged();
            if (Handler?.PlatformView is Microsoft.UI.Xaml.FrameworkElement frameworkElement)
            {
                frameworkElement.KeyDown += (sender, e) =>
                {
                    Debug.WriteLine(e.Key);
                    _keyEventService.NotifyKeyPressed(new KeyPressedEventArgs(e.Key.ToString()));
                };
            }
        }
#endif
    }
}

