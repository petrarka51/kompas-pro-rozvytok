
const Statistics = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Моя статистика</h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="px-4 py-2 bg-compass-blue text-white rounded-md">За 7 днів</button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">За 30 днів</button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">За весь час</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Фізичний розвиток</h3>
            <div className="h-64 flex items-center justify-center bg-white rounded border">
              <p className="text-gray-500 text-center px-4">
                Тут буде графік фізичної активності<br />
                (У повній версії додатку)
              </p>
            </div>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Емоційний розвиток</h3>
            <div className="h-64 flex items-center justify-center bg-white rounded border">
              <p className="text-gray-500 text-center px-4">
                Тут буде графік емоцій<br />
                (У повній версії додатку)
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-compass-purple-light p-6 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🐴</div>
            <div>
              <p className="text-lg font-medium mb-2">Семен помітив:</p>
              <p>За останній тиждень ти найчастіше обирав цінність "Будь справжнім!". Це круто! Щирість — основа внутрішньої гармонії.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Активність за днями</h3>
            <div className="h-64 flex items-center justify-center bg-white rounded border">
              <p className="text-gray-500 text-center px-4">
                Тут буде графік активності за днями<br />
                (У повній версії додатку)
              </p>
            </div>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Цінності</h3>
            <div className="h-64 flex items-center justify-center bg-white rounded border">
              <p className="text-gray-500 text-center px-4">
                Тут буде діаграма цінностей<br />
                (У повній версії додатку)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
