import { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useBasket } from 'utils/BasketContext'; 

export default function BasketPage() {
    const { basketItems, removeFromBasket, updateQuantity, addToBasket } = useBasket();

    const [suggestedItems, setSuggestedItems] = useState([
        {
            id: 3,
            name: 'Sony PlayStation 5',
            price: 200.00,
            image: '/marketplace/ps5.jpeg',
        },
        {
            id: 4,
            name: 'Dell XPS 13',
            price: 220.00,
            image: '/marketplace/dell.jpeg',
        },
        {
            id: 5,
            name: 'Xiaomi Mi 11',
            price: 120.00,
            image: '/marketplace/xiaomi.jpeg',
        },
    ]);

    const handleRemove = (id) => {
        const removedItem = basketItems.find(item => item.id === id);
        removeFromBasket(id); 

        if (removedItem) {
            setSuggestedItems([...suggestedItems, { ...removedItem, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (id, quantity) => {
        updateQuantity(id, quantity); 
    };

    const handleAddToBasket = (item) => {
        addToBasket(item); // Use the context method to add the item to the basket

        // Sepete eklenince önerilenlerden kaldır
        setSuggestedItems(suggestedItems.filter(suggestedItem => suggestedItem.id !== item.id));
    };

    const total = basketItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-3xl font-bold text-center mb-6">Sepetim</h1>
            {basketItems.length === 0 ? (
                <div className="text-gray-600 text-lg mb-4 text-center">
                    <p>Sepetinizde ürün bulunmamaktadır.</p>
                    <a href="/marketplace">
                        <button className="bg-[#34495e] text-white py-2 px-6 rounded-md mt-4 hover:bg-[#2c3e50] transition">
                            Alışverişe Başla
                        </button>
                    </a>
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ul className="space-y-4">
                        {basketItems.map((item) => (
                            <li key={item.id} className="flex items-center justify-between bg-white shadow-lg p-4 rounded-lg">
                                <div className="flex items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-20 w-20 object-contain rounded-lg"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-gray-500">Fiyat: {item.price} TL</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        className="w-16 p-2 border rounded-md"
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    />
                                    <p className="font-bold">{(item.price * item.quantity).toFixed(2)} TL</p>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {basketItems.length > 0 && (
                    <div className="flex flex-col justify-between shadow-lg p-6 rounded-lg h-min">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Özet</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Toplam</span>
                                    <span>{total} TL</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Toplam tutar KDV dahil hesaplanmıştır.</p>
                        </div>

                        <button className="mt-6 w-full bg-[#34495e] text-white py-2 rounded-md hover:bg-[#2c3e50] transition">
                            Ödeme Yap
                        </button>
                    </div>
                )}
            </div>

            {/* Önerilen Ürünler */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-center">Önerilen Ürünler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {suggestedItems.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <img src={item.image} alt={item.name} className="h-40 w-full object-contain mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                            <p className="text-gray-600 mb-4">Fiyat: {item.price} TL</p>
                            <button
                                className="bg-[#34495e] text-white py-2 px-4 rounded-md hover:bg-[#2c3e50] transition"
                                onClick={() => handleAddToBasket(item)}
                            >
                                Sepete Ekle
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
