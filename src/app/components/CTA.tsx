export default function CTA() {
  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8">
          Browse our listings or sell your own account today.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
          >
            Browse Accounts
          </a>
          <a
            href="#"
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full"
          >
            Sell Account
          </a>
        </div>
      </div>
    </div>
  );
}