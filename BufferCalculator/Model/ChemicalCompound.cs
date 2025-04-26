using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BufferCalculator.Model
{
    public class ChemicalCompound
    {
        public string Name { get; set; }
        public string Formula { get; set; }
        public string MolarMass { get; set; }
        public string Uses { get; set; }
        public string ImageUrl { get; set; }
        public double Opacity { get; set; } = 1;
        public int RelativePosition { get; set; }
        public double Scale { get; set; } = 1;
        public string ModelUrl { get; set; }
    }
}
