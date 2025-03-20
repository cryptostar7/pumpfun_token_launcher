
// import React, { useState } from 'react';
// import Header from '@/components/Layout/Header';
// import { Card, CardContent } from '@/components/UI/Card';
// import Button from '@/components/UI/Button';
// import Input from '@/components/UI/Input';
// import { Search, Filter, Trending, ArrowDown, ArrowUp } from 'lucide-react';

// // Sample token data
// const tokens = [
//   {
//     id: 1,
//     name: 'Minty Girl',
//     symbol: 'MINTY',
//     price: 2.45,
//     change: 12.5,
//     volume: 45600,
//     image: '/lovable-uploads/b5d5b77e-4d2a-4f9b-ab4e-4fcb52a10acf.png',
//   },
//   {
//     id: 2,
//     name: 'Crypto Punk',
//     symbol: 'PUNK',
//     price: 0.89,
//     change: -5.2,
//     volume: 23400,
//     image: 'https://placehold.co/400x400/5bbde5/ffffff?text=CP',
//   },
//   {
//     id: 3,
//     name: 'Moon Rocket',
//     symbol: 'MOON',
//     price: 1.23,
//     change: 45.7,
//     volume: 78900,
//     image: 'https://placehold.co/400x400/e55b88/ffffff?text=MR',
//   },
//   {
//     id: 4,
//     name: 'Degen Token',
//     symbol: 'DEGEN',
//     price: 0.12,
//     change: 120.4,
//     volume: 345600,
//     image: 'https://placehold.co/400x400/5be58f/ffffff?text=DT',
//   },
//   {
//     id: 5,
//     name: 'Sol Flare',
//     symbol: 'FLARE',
//     price: 3.78,
//     change: -2.8,
//     volume: 12800,
//     image: 'https://placehold.co/400x400/e5c35b/ffffff?text=SF',
//   },
//   {
//     id: 6,
//     name: 'Meme Coin',
//     symbol: 'MEME',
//     price: 0.003,
//     change: 543.2,
//     volume: 987000,
//     image: 'https://placehold.co/400x400/b25be5/ffffff?text=MC',
//   },
// ];

// const formatNumber = (num: number) => {
//   if (num >= 1000000) {
//     return `${(num / 1000000).toFixed(1)}M`;
//   } else if (num >= 1000) {
//     return `${(num / 1000).toFixed(1)}K`;
//   }
//   return num.toString();
// };

// const Marketplace = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState('volume');
//   const [sortDirection, setSortDirection] = useState('desc');
  
//   const handleSort = (column: string) => {
//     if (sortBy === column) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(column);
//       setSortDirection('desc');
//     }
//   };
  
//   const filteredTokens = tokens.filter(token => 
//     token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const sortedTokens = [...filteredTokens].sort((a, b) => {
//     let comparison = 0;
    
//     if (sortBy === 'name') {
//       comparison = a.name.localeCompare(b.name);
//     } else if (sortBy === 'price') {
//       comparison = a.price - b.price;
//     } else if (sortBy === 'change') {
//       comparison = a.change - b.change;
//     } else { // volume
//       comparison = a.volume - b.volume;
//     }
    
//     return sortDirection === 'asc' ? comparison : -comparison;
//   });
  
//   const SortIcon = ({ column }: { column: string }) => {
//     if (sortBy !== column) return null;
    
//     return sortDirection === 'asc' ? 
//       <ArrowUp className="h-4 w-4 ml-1" /> : 
//       <ArrowDown className="h-4 w-4 ml-1" />;
//   };
  
//   return (
//     <div className="min-h-screen">
//       <Header />
      
//       <div className="pt-32 pb-20 px-4">
//         <div className="container max-w-6xl mx-auto">
//           <div className="mb-12">
//             <h1 className="text-3xl font-bold">Marketplace</h1>
//             <p className="text-muted-foreground mt-2">Browse and discover trending tokens</p>
//           </div>
          
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
//             <div className="w-full md:w-auto flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <input
//                   type="text"
//                   placeholder="Search tokens by name or symbol..."
//                   className="w-full pl-10 pr-4 py-2 border border-input rounded-full bg-white focus:ring-2 focus:ring-primary/30 transition-all"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <Button variant="outline" size="sm" className="flex items-center gap-2">
//                 <Filter className="h-4 w-4" />
//                 <span>Filter</span>
//               </Button>
//               <Button variant="outline" size="sm" className="flex items-center gap-2">
//                 <Trending className="h-4 w-4" />
//                 <span>Trending</span>
//               </Button>
//             </div>
//           </div>
          
//           <Card className="overflow-hidden shadow-soft">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-accent/50 border-b">
//                   <tr>
//                     <th className="text-left p-4 font-medium text-muted-foreground text-sm">#</th>
//                     <th className="text-left p-4 font-medium text-muted-foreground text-sm">Token</th>
//                     <th 
//                       className="text-right p-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground flex items-center justify-end"
//                       onClick={() => handleSort('price')}
//                     >
//                       <span>Price</span>
//                       <SortIcon column="price" />
//                     </th>
//                     <th 
//                       className="text-right p-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground flex items-center justify-end"
//                       onClick={() => handleSort('change')}
//                     >
//                       <span>24h %</span>
//                       <SortIcon column="change" />
//                     </th>
//                     <th 
//                       className="text-right p-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground flex items-center justify-end"
//                       onClick={() => handleSort('volume')}
//                     >
//                       <span>Volume</span>
//                       <SortIcon column="volume" />
//                     </th>
//                     <th className="text-right p-4 font-medium text-muted-foreground text-sm">Buy</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sortedTokens.map((token, index) => (
//                     <tr key={token.id} className="border-b hover:bg-accent/20 transition-colors">
//                       <td className="p-4 text-sm">{index + 1}</td>
//                       <td className="p-4">
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-accent flex-shrink-0">
//                             <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
//                           </div>
//                           <div>
//                             <div className="font-medium">{token.name}</div>
//                             <div className="text-xs text-muted-foreground">{token.symbol}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4 text-right font-medium">${token.price.toFixed(3)}</td>
//                       <td className={`p-4 text-right font-medium ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                         {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
//                       </td>
//                       <td className="p-4 text-right text-muted-foreground">
//                         ${formatNumber(token.volume)}
//                       </td>
//                       <td className="p-4 text-right">
//                         <Button variant="outline" size="sm" className="rounded-full">
//                           Buy
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
          
//           <div className="mt-12 text-center">
//             <Button variant="outline" className="rounded-full">
//               Load More
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Marketplace;

const NotFound = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Marketplace Page</h1>
        <p className="text-xl text-gray-600 mb-4">Marketplace Page</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Marketplace Page
        </a>
      </div>
    </div>
  );
};

export default NotFound;
