import { FaSpinner, FaShoppingCart, FaStar } from 'react-icons/fa';

const products = [
    {
        "itemId": "1",
        "name": "iPhone 15",
        "description": "En yeni iPhone modeli, üstün performans ve şık tasarım.",
        "price": 100.00,
        "image": "/marketplace/telefon.jpeg",
        "companyImage": "/marketplace/apple.jpeg",
        "charityName": "Apple"
    },
    {
        "itemId": "2",
        "name": "Samsung Galaxy S24",
        "description": "Yüksek çözünürlüklü ekran ve uzun ömürlü batarya.",
        "price": 150.00,
        "image": "/marketplace/tv.jpeg",
        "companyImage": "/marketplace/samsung.png",
        "charityName": "Samsung"
    },
    {
        "itemId": "3",
        "name": "Casper Nirvana",
        "description": "Güçlü işlemci ve geniş depolama alanı.",
        "price": 150.00,
        "image": "/marketplace/pc.jpeg",
        "companyImage": "/marketplace/trendyol.png",
        "charityName": "Trendyol"
    },
    {
        "itemId": "4",
        "name": "MacBook Pro",
        "description": "Yüksek performanslı dizüstü bilgisayar, grafik tasarımcılar için ideal.",
        "price": 250.00,
        "image": "/marketplace/macbook.jpeg",
        "companyImage": "/marketplace/apple.jpeg",
        "charityName": "Apple"
    },
    {
        "itemId": "5",
        "name": "Sony PlayStation 5",
        "description": "Yeni nesil oyun deneyimi, ultra hızlı yükleme süreleri.",
        "price": 200.00,
        "image": "/marketplace/ps5.jpeg",
        "companyImage": "/marketplace/sony.png",
        "charityName": "Sony"
    },
    {
        "itemId": "6",
        "name": "Xiaomi Mi 11",
        "description": "Kapsamlı kamera özellikleri ve yüksek hızlı işlemci.",
        "price": 120.00,
        "image": "/marketplace/xiaomi.jpeg",
        "companyImage": "/marketplace/xiaomi.png",
        "charityName": "Xiaomi"
    },
    {
        "itemId": "7",
        "name": "Lenovo ThinkPad X1",
        "description": "Hafif ve dayanıklı, iş dünyasına yönelik mükemmel dizüstü.",
        "price": 180.00,
        "image": "/marketplace/lenovo.jpeg",
        "companyImage": "/marketplace/lenovo.png",
        "charityName": "Lenovo"
    },
    {
        "itemId": "8",
        "name": "Huawei P50 Pro",
        "description": "Gelişmiş kamera teknolojisi ve şık tasarım.",
        "price": 140.00,
        "image": "/marketplace/huawei.jpeg",
        "companyImage": "/marketplace/huawei.png",
        "charityName": "Huawei"
    },
    {
        "itemId": "9",
        "name": "Dell XPS 13",
        "description": "İnce ve hafif, mükemmel ekran kalitesi.",
        "price": 220.00,
        "image": "/marketplace/dell.jpeg",
        "companyImage": "/marketplace/dell.png",
        "charityName": "Dell"
    },
    {
        "itemId": "10",
        "name": "Microsoft Surface Pro 8",
        "description": "Tablet ve dizüstü bir arada, güçlü performans.",
        "price": 230.00,
        "image": "/marketplace/surface.jpeg",
        "companyImage": "/marketplace/microsoft.jpeg",
        "charityName": "Microsoft"
    }
];

export default function Home() {
    return (
        <>
            <header className='w-full bg-[rgb(255,168,82)] py-4 shadow-md'>
                <div className='container mx-auto'>
                    <h1 className='text-3xl font-bold italic text-center text-white'>
                        İHTİYAÇ PAZARYERİ
                    </h1>
                </div>
            </header>
            <main className='mx-auto px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 py-6'>
                <div className='grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                    {products.map((product) => (
                        <div key={product.itemId} className='border rounded-2xl shadow-lg overflow-hidden flex flex-col bg-white'>
                            <a href={`/product?id=${product.itemId}`} className='block'>
                                <img
                                    className='h-40 w-full object-contain'
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                />
                            </a>
                            <div className='p-4 flex flex-col flex-1'>
                                <a href={`/product?id=${product.itemId}`} className='text-lg font-semibold text-gray-800 hover:text-indigo-600'>
                                    {product.name}
                                </a>
                                <p className='text-gray-600 mt-2 flex-1 text-sm'>
                                    {product.description.length > 80
                                        ? `${product.description.substring(0, 80)}...`
                                        : product.description}
                                </p>

                                <div className='flex items-center ml-auto text-xs'>
                                    <span className='mr-2 text-gray-600'>4.0</span>
                                    <FaStar className='text-yellow-400' />
                                    <FaStar className='text-yellow-400' />
                                    <FaStar className='text-yellow-400' />
                                    <FaStar className='text-yellow-400' />
                                    <FaStar className='text-gray-300' />
                                </div>

                                <div className='mt-4 flex items-center justify-between'>
                                    <span className='text-md font-bold text-indigo-600'>
                                        {product.price ? `${product.price} TL` : 'Fiyat Belirtilmemiş'}
                                    </span>
                                    <button className='flex items-center bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700 transition'>
                                        <FaShoppingCart className='mr-1' />
                                    </button>
                                </div>
                                <div className='mt-4 flex items-center'>
                                    <img className='w-8 h-8 rounded-full object-contain' src={product.companyImage} alt={product.charityName} />
                                    <span className='text-xs text-gray-700 ml-2'>
                                        <strong>{product.charityName}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className='w-full bg-gray-800 text-white py-4 text-center'>
                © {new Date().getFullYear()} İHTİYAÇ PAZARYERİ. Tüm hakları saklıdır.
            </footer>
        </>
    );
}
