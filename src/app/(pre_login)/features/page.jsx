import FeatureCard from "@/components/featureCard"

export default function Features(){
    const features = [
        {
            title: "AI-Powered Arguments",
            content: "Generate structured legal arguments in IRAC format instantly.",
            icon: "ri-brain-line",
            color: "bg-purple-200 text-purple-600"
        },
        {
            title: "Case Summaries",
            content: "Get concise case summaries for faster decision-making.",
            icon: "ri-file-text-line",
            color: "bg-blue-200 text-blue-600"
        },
        {
            title: "Precedent Finder",
            content: "Quickly search relevant precedents for stronger arguments.",
            icon: "ri-search-line",
            color: "bg-green-200 text-green-600"
        },
        {
            title: "Collaboration",
            content: "Work with your team seamlessly on shared cases.",
            icon: "ri-team-line",
            color: "bg-yellow-200 text-yellow-600"
        },
        {
            title: "Dark Mode",
            content: "Focus on work comfortably with built-in dark mode.",
            icon: "ri-moon-line",
            color: "bg-gray-200 text-gray-600"
        },
        {
            title: "Export Options",
            content: "Download arguments in PDF, DOCX, or Markdown.",
            icon: "ri-download-2-line",
            color: "bg-red-200 text-red-600"
        },
        {
            title: "Secure Cloud",
            content: "Your data is encrypted and securely stored in the cloud.",
            icon: "ri-lock-line",
            color: "bg-pink-200 text-pink-600"
        },
        {
            title: "Analytics",
            content: "Track case insights and usage analytics in one place.",
            icon: "ri-bar-chart-line",
            color: "bg-indigo-200 text-indigo-600"
        },
    ];
    return(
        <div className="min-h-screen bg-[url('/light.jpg')] dark:bg-[url('/dark.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center dark:text-white">
            <div className="flex gap-2 flex-col p-6 mt-10 md:mt-0">
                <p className="text-sm text-gray-500 text-center">OUR FEATURES</p>
                <h1 className="text-4xl font-semibold text-center">Everything You Need for Smarter Legal Arguments</h1>
                <p className="text-sm text-gray-500 text-center mt-2">Streamline case analysis, boost efficiency, and argue with confidence.</p>
                {/* grid layout for features */}
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {features.map((feature, idx) => (
                        <FeatureCard
                            key={idx}
                            title={feature.title}
                            content={feature.content}
                            icon={feature.icon}
                            color={feature.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}