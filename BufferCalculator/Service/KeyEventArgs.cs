using BufferCalculator.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BufferCalculator.Service
{
    public interface IKeyEventService
    {
        event EventHandler<KeyPressedEventArgs> KeyPressed;
        void NotifyKeyPressed(KeyPressedEventArgs args);
    }

    public class KeyPressedEventArgs : EventArgs
    {
        public string Key { get; }

        public KeyPressedEventArgs(string key)
        {
            Key = key;
        }
    }
    public class KeyEventService : IKeyEventService
    {
        public event EventHandler<KeyPressedEventArgs> KeyPressed;

        public void NotifyKeyPressed(KeyPressedEventArgs args)
        {
            KeyPressed?.Invoke(this, args);
        }
    }
}
