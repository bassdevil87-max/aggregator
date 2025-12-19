import { useState } from 'react';
import Head from 'next/head';
import { Search, MapPin, DollarSign, Filter } from 'lucide-react';
import inventoryData from '../../data/inventory.json'; // Reads your Python data

export async function getStaticProps() {
  // This builds the page at compile time for SEO speed
  return {
    props: {
      initialData: inventoryData
    },
  };
}

export default function Home({ initialData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMake, setFilterMake] = useState('All');

  // Filter Logic
  const filteredInventory = initialData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMake = filterMake === 'All' || item.make === filterMake;
    return matchesSearch && matchesMake;
  });

  const makes = ['All', ...new Set(initialData.map(item => item.make))];

  return (
    <div className="min-h-screen">
      <Head>
        <title>IronMarket | Used Heavy Equipment Aggregator</title>
        <meta name="description" content="Find used excavators and skid steers from 50+ dealers." />
      </Head>

      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Iron<span className="text-yellow-500">Market</span></h1>
          <button className="bg-yellow-500 text-slate-900 px-4 py-2 rounded font-bold text-sm">Post Equipment</button>
        </div>
      </nav>

      {/* Hero Search */}
      <div className="bg-slate-800 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">Find Used Equipment. Get Financing.</h2>
          <p className="text-slate-400 mb-8">Aggregating inventory from 500+ local dealers nationwide.</p>
          
          <div className="flex gap-2 max-w-lg mx-auto bg-white p-2 rounded-lg">
            <Search className="text-slate-400 ml-2 mt-2" />
            <input 
              type="text" 
              placeholder="Search '2019 Cat Excavator'..." 
              className="w-full p-2 text-slate-900 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 sticky top-24">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Filter size={18}/> Filters</h3>
            
            <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturer</label>
            <select 
              className="w-full border border-slate-300 rounded p-2 mb-4"
              value={filterMake}
              onChange={(e) => setFilterMake(e.target.value)}
            >
              {makes.map(make => <option key={make} value={make}>{make}</option>)}
            </select>
          </div>
        </aside>

        {/* Listings Grid */}
        <section className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map(item => (
              <div key={item.id} className="card group">
                {/* Image Placeholder */}
                <div className="h-48 bg-slate-200 relative">
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600">{item.title}</h3>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-4">{item.formatted_price}</p>
                  
                  {/* THE MONEY MAKER */}
                  <a 
                    href="https://www.smarterfinanceusa.com/equipment-financing-calculator" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mb-2"
                  >
                    Get Financing
                  </a>
                  
                  <a href={item.link} className="block text-center text-slate-500 text-sm hover:underline">
                    View Dealer Listing
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}