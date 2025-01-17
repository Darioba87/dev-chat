import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-blue-500 to-purple-600">
        <h1 className="text-5xl font-extrabold mb-4">
          Connect, Chat, and Share in Real-Time
        </h1>
        <p className="text-lg max-w-xl mb-6">
          Discover the easiest way to stay connected with friends and colleagues.
        </p>
       
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          <FeatureCard
            title="Real-Time Chat"
            description="Send and receive messages instantly."
            icon="💬"
          />
          <FeatureCard
            title="GIFs and Emojis"
            description="Express yourself with fun GIPHY integrations."
            icon="🎉"
          />
          <FeatureCard
            title="Content Moderation (TODO)"
            description="Keep conversations clean with our filter system."
            icon="🔒"
          />
          <FeatureCard
            title="Custom Avatars"
            description="Stand out with a unique avatar."
            icon="👤"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900 text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center space-x-4 mb-4">
                
                <Image src={`https://i.pravatar.cc/150?img=${i + 1}`} alt="user" width={10} height={10} className="w-12 h-12 rounded-full" />
                           <div>
                  <h3 className="font-bold">User {i + 1}</h3>
                  <p className="text-sm text-gray-400">Happy user</p>
                </div>
              </div>
              <p className="text-gray-300">
                This chat is amazing! I love using GIFs and emojis.
              </p>
            </div>
          ))}
        </div>
      </section>

    
      
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg text-left">
      <div className="text-4xl">{icon}</div>
      <h3 className="font-bold text-xl mt-4">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
  );
}
