
const ValuesPage = () => {
  const values = [
    {
      title: "Будь вільним!",
      description: "Свобода духу і вміння робити свідомий вибір. Це означає брати на себе відповідальність за своє життя, думки та дії."
    },
    {
      title: "Будь справжнім!",
      description: "Щирість у намірах та вчинках. Це відвага бути собою, визнавати свої сильні та слабкі сторони, та діяти відповідно до своїх переконань."
    },
    {
      title: "Будь допитливим!",
      description: "Прагнення до нового знання та відкритість до різних поглядів. Це постійний пошук, запитання та критичне мислення."
    },
    {
      title: "Будь відповідальним!",
      description: "Усвідомлення наслідків своїх дій і рішень. Це розуміння власного впливу на інших та готовність відповідати за свої вчинки."
    },
    {
      title: "Будь мужнім!",
      description: "Сміливість долати перешкоди та відстоювати свої принципи. Це здатність вставати після невдач та рухатися вперед."
    },
    {
      title: "Будь сильним!",
      description: "Витривалість у випробуваннях та вміння підтримувати інших. Це сила характеру, яка проявляється не лише в дії, але й у стійкості."
    },
    {
      title: "Бо ми — Україна!",
      description: "Народ борців, земля добра та свободи. Це відчуття єдності, спільної історії та відповідальності за майбутнє нашої країни."
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
