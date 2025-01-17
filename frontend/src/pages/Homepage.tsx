import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/Jeans.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/Glasses.png" },
  { href: "/suits", name: "Suits", imageUrl: "/Suits.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/Shoes.jpg" },
  { href: "/jacket", name: "Jackets", imageUrl: "/Jackets.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/Bags.jpg" },
];

const Homepage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center sm:text-6xl text-5xl  text-emerald-500 font-bold mb-4">
          Explore your categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, idx) => (
            <CategoryItem key={idx} data={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
