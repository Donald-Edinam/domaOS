export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-20">
        {/* Beta Badge */}
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg shadow-purple-300/50 dark:shadow-purple-500/30 ring-1 ring-purple-200/50 dark:ring-purple-500/30 animate-pulse">
          Currently in Beta Mode ⭐
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center max-w-5xl mb-6 leading-tight text-gray-900 dark:text-white font-sans">
          Find & Buy Expiring{" "}
          <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Domains Faster
          </span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mb-12 leading-relaxed font-sans">
          The fastest platform for SaaS founders to discover, analyze, and
          acquire high-quality expiring domains before your competition.
        </p>

        {/* CTA Section - Coming Soon */}
        <div className="flex items-center justify-center mb-16">
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Coming Soon
            </p>
          </div>
        </div>

        {/* Tokenization Section - Positioned to peek above fold */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Tokenized Domain Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 max-w-4xl mx-auto border-2 border-purple-300 dark:border-purple-400 shadow-purple-300/60 dark:shadow-purple-400/40 shadow-2xl ring-1 ring-purple-200/50 dark:ring-purple-500/30">
            {/* Tokenized Domain Image */}
            <div className="text-center">
              <img
                src="/tokenized.avif"
                alt="Tokenized Domain Example"
                className="mx-auto rounded-2xl shadow-lg max-w-full h-auto"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-sans">
                Example of a tokenized domain with fractional ownership
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
