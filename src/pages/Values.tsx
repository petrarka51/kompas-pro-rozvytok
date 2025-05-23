
const ValuesPage = () => {
  const values = [
    {
      title: "Будь вільним!",
      description: "В свободі духу творити себе та кращий світ навколо себе."
    },
    {
      title: "Будь справжнім!",
      description: "Єдиним у думці, у слові й у ділі, щирим у намірах і щедрим у діях."
    },
    {
      title: "Будь другом!",
      description: "із Всесвітом, із людством і з Україною, з кожним хто поруч, хто тут і сьогодні, щоб нами почате не мало кінця."
    },
    {
      title: "Будь мудрим!",
      description: "дивитися глибше і бачити краще, любити життя й обирати добро."
    },
    {
      title: "Будь творчим!",
      description: "Відважно йти вперед з відкритим навстіж серцем, поглядом мрії сягаючи за обрії можливості."
    },
    {
      title: "Будь!",
      description: "Не вагатися! Не боятися! Не вдавати! Справді бути і бути разом!"
    },
    {
      title: "Бо ми — Україна!",
      description: "народ борців, земля добра, край гідності і свободи, наша праця, наша мрія, наша доля!"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Цінності</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div 
            key={index} 
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className={`h-3 ${getColorClass(index)}`}></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get a color class based on index
function getColorClass(index: number): string {
  const colors = [
    "bg-compass-blue",
    "bg-compass-purple", 
    "bg-compass-green",
    "bg-compass-yellow", 
    "bg-compass-red",
    "bg-compass-brown",
    "bg-compass-blue"
  ];
  
  return colors[index % colors.length];
}

export default ValuesPage;
