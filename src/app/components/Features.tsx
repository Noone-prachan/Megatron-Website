export default function Features() {
  return (
    <div className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Secure Transactions</h3>
            <p>
              We use Discord for authentication and provide a secure platform
              for all transactions.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Detailed Listings</h3>
            <p>
              Our listings provide detailed information about each account, so
              you know exactly what you're buying.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Manual Payment Processing</h3>
            <p>
              We handle all payments directly through Discord, making it
              secure and straightforward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}